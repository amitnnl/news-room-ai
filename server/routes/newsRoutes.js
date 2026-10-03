import express from 'express';
import { query } from '../config/db.js';
import { aiProvider } from '../providers/aiProvider.js';

const router = express.Router();

// GET /api/news/categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await query('SELECT * FROM news_categories ORDER BY id ASC');
    return res.json({ success: true, categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/news
router.get('/', async (req, res) => {
  try {
    const { status, category, search, language, is_breaking, limit = 50 } = req.query;
    let sql = `
      SELECT a.*, c.name as category_name, u.name as author_name
      FROM news_articles a
      LEFT JOIN news_categories c ON a.category_id = c.id
      LEFT JOIN users u ON a.author_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'all') {
      sql += ` AND a.status = ?`;
      params.push(status);
    }
    if (category) {
      sql += ` AND (c.slug = ? OR a.category_id = ?)`;
      params.push(category, category);
    }
    if (language) {
      sql += ` AND a.language = ?`;
      params.push(language);
    }
    if (is_breaking !== undefined && is_breaking !== '') {
      sql += ` AND a.is_breaking = ?`;
      params.push(is_breaking === 'true' || is_breaking === '1' ? 1 : 0);
    }
    if (search) {
      sql += ` AND (a.title LIKE ? OR a.summary LIKE ? OR a.seo_keywords LIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY a.is_breaking DESC, a.created_at DESC LIMIT ?`;
    params.push(parseInt(limit, 10));

    const articles = await query(sql, params);
    return res.json({ success: true, articles });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/news/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const articleRows = await query(
      `SELECT a.*, c.name as category_name, u.name as author_name
       FROM news_articles a
       LEFT JOIN news_categories c ON a.category_id = c.id
       LEFT JOIN users u ON a.author_id = u.id
       WHERE a.id = ? OR a.slug = ?`,
      [id, id]
    );

    if (articleRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const article = articleRows[0];

    // Fetch related research
    const researchRows = await query('SELECT * FROM news_research WHERE article_id = ?', [article.id]);
    // Fetch related sources
    const sourceRows = await query('SELECT * FROM news_sources WHERE article_id = ?', [article.id]);
    // Fetch related fact check
    const factCheckRows = await query('SELECT * FROM fact_checks WHERE article_id = ?', [article.id]);
    // Fetch related social posts
    const socialRows = await query('SELECT * FROM social_posts WHERE article_id = ?', [article.id]);
    // Fetch related video projects
    const videoRows = await query('SELECT * FROM youtube_videos WHERE article_id = ?', [article.id]);
    // Fetch version history
    const versionRows = await query(
      `SELECT v.*, u.name as editor_name 
       FROM news_versions v 
       LEFT JOIN users u ON v.edited_by = u.id 
       WHERE v.article_id = ? ORDER BY v.version_number DESC`,
      [article.id]
    );

    return res.json({
      success: true,
      article,
      research: researchRows[0] || null,
      sources: sourceRows,
      factCheck: factCheckRows[0] || null,
      socialPosts: socialRows,
      videos: videoRows,
      versions: versionRows
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/news/:id - Update article
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      summary,
      content,
      category_id,
      status,
      featured_image,
      seo_title,
      meta_description,
      breaking_headline,
      short_headline,
      change_summary = 'Manual update by editor',
      userId = 1
    } = req.body;

    // Get current version count
    const [verCount] = await query('SELECT COUNT(*) as cnt FROM news_versions WHERE article_id = ?', [id]);
    const nextVer = (verCount?.cnt || 0) + 1;

    // Save previous snapshot to version history
    const [current] = await query('SELECT title, content FROM news_articles WHERE id = ?', [id]);
    if (current) {
      await query(
        `INSERT INTO news_versions (article_id, title, content, edited_by, change_summary, version_number)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, current.title, current.content, userId, change_summary, nextVer]
      );
    }

    // Update active article
    await query(
      `UPDATE news_articles SET 
        title = COALESCE(?, title),
        summary = COALESCE(?, summary),
        content = COALESCE(?, content),
        category_id = COALESCE(?, category_id),
        status = COALESCE(?, status),
        featured_image = COALESCE(?, featured_image),
        seo_title = COALESCE(?, seo_title),
        meta_description = COALESCE(?, meta_description),
        breaking_headline = COALESCE(?, breaking_headline),
        short_headline = COALESCE(?, short_headline),
        updated_at = NOW()
       WHERE id = ?`,
      [
        title,
        summary,
        content,
        category_id,
        status,
        featured_image,
        seo_title,
        meta_description,
        breaking_headline,
        short_headline,
        id
      ]
    );

    // Audit log
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES (?, 'ARTICLE_UPDATED', 'news_articles', ?, ?)`,
      [userId, id, `Article #${id} updated with change: "${change_summary}"`]
    );

    return res.json({ success: true, message: 'Article updated successfully and new version recorded.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/news/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, userId = 1, notes } = req.body;

    const publishedAt = status === 'published' ? 'NOW()' : 'published_at';

    await query(
      `UPDATE news_articles 
       SET status = ?, published_at = ${status === 'published' ? 'NOW()' : 'published_at'} 
       WHERE id = ?`,
      [status, id]
    );

    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES (?, 'STATUS_CHANGE', 'news_articles', ?, ?)`,
      [userId, id, `Status transitioned to "${status}". Notes: ${notes || 'None'}`]
    );

    return res.json({ success: true, status, message: `Status updated to ${status}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/news/:id/ai-action
router.post('/:id/ai-action', async (req, res) => {
  try {
    const { id } = req.params;
    const { action, currentText, targetLanguage = 'hi' } = req.body;

    const [art] = await query('SELECT * FROM news_articles WHERE id = ?', [id]);
    if (!art) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    let prompt = '';
    if (action === 'improve') {
      prompt = `Improve the journalistic quality, rhythm, and clarity of this news text while preserving all facts:\n\n${currentText || art.content}`;
    } else if (action === 'shorten') {
      prompt = `Summarize and shorten this news article into 3 concise paragraphs suitable for quick reading:\n\n${currentText || art.content}`;
    } else if (action === 'expand') {
      prompt = `Add contextual background, historical precedent, and analytical perspective to expand this news article:\n\n${currentText || art.content}`;
    } else if (action === 'translate') {
      prompt = `Translate this article accurately into ${targetLanguage === 'hi' ? 'Hindi' : 'English'}, using professional newsroom vocabulary:\n\n${currentText || art.content}`;
    } else if (action === 'fact_check') {
      prompt = `Strictly fact-check this text. Identify claims requiring independent verification:\n\n${currentText || art.content}`;
    } else if (action === 'generate_headlines') {
      prompt = `Generate 5 fresh and compelling headline variations for this story:\n\n${art.title}\n${art.summary}`;
    }

    const aiRes = await aiProvider.generate({
      systemPrompt: 'You are an expert digital news editor assistant. Provide high-quality response.',
      userPrompt: prompt,
      jsonMode: false,
      agentCode: 'writer_agent'
    });

    return res.json({ success: true, action, result: aiRes });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/news/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM news_articles WHERE id = ?', [id]);
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES (1, 'ARTICLE_DELETED', 'news_articles', ?, 'Article removed by editor')`,
      [id]
    );
    return res.json({ success: true, message: 'Article deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
