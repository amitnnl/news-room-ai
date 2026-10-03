import express from 'express';
import Parser from 'rss-parser';
import { query } from '../config/db.js';
import { orchestrator } from '../agents/orchestrator.js';

const router = express.Router();
const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'BharatPulseNewsBot/1.0' }
});

// GET /api/rss/sources
router.get('/sources', async (req, res) => {
  try {
    const sources = await query('SELECT * FROM rss_sources ORDER BY id ASC');
    return res.json({ success: true, sources });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/rss/sources - Add new feed
router.post('/sources', async (req, res) => {
  try {
    const { name, url, category = 'General', language = 'hi' } = req.body;
    if (!name || !url) {
      return res.status(400).json({ success: false, message: 'Name and RSS Feed URL are required.' });
    }
    const result = await query(
      `INSERT INTO rss_sources (name, url, category, language, active) VALUES (?, ?, ?, ?, 1)`,
      [name, url, category, language]
    );
    return res.json({ success: true, sourceId: result.insertId, message: 'RSS Source added.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/rss/items
router.get('/items', async (req, res) => {
  try {
    const items = await query(
      `SELECT i.*, s.name as source_name 
       FROM rss_items i 
       LEFT JOIN rss_sources s ON i.source_id = s.id 
       ORDER BY i.published_date DESC, i.id DESC LIMIT 50`
    );
    return res.json({ success: true, items });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/rss/fetch - Ingest real live RSS feeds
router.post('/fetch', async (req, res) => {
  try {
    const sources = await query('SELECT * FROM rss_sources WHERE active = 1');
    let totalIngested = 0;

    for (const source of sources) {
      try {
        const feed = await parser.parseURL(source.url);
        if (feed && feed.items) {
          for (const item of feed.items.slice(0, 5)) {
            const title = item.title?.trim();
            const link = item.link || item.guid || `${source.url}#${Date.now()}`;
            const summary = item.contentSnippet || item.content || item.summary || '';
            const pubDate = item.pubDate ? new Date(item.pubDate) : new Date();

            try {
              await query(
                `INSERT INTO rss_items (source_id, title, link, summary, published_date)
                 VALUES (?, ?, ?, ?, ?)
                 ON DUPLICATE KEY UPDATE summary=VALUES(summary)`,
                [source.id, title, link, summary.substring(0, 1000), pubDate]
              );
              totalIngested++;
            } catch (insErr) {
              // Ignore duplicate URL collisions
            }
          }
        }
        await query('UPDATE rss_sources SET last_checked = NOW() WHERE id = ?', [source.id]);
      } catch (feedErr) {
        console.warn(`Could not parse RSS feed ${source.name} (${source.url}):`, feedErr.message);
      }
    }

    return res.json({
      success: true,
      message: `RSS Ingestion complete. Scanned ${sources.length} sources, recorded latest feed items.`,
      totalIngested
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/rss/items/:id/convert - Convert RSS item into an AI news package
router.post('/items/:id/convert', async (req, res) => {
  try {
    const { id } = req.params;
    const [item] = await query('SELECT * FROM rss_items WHERE id = ?', [id]);
    if (!item) {
      return res.status(404).json({ success: false, message: 'RSS Item not found' });
    }

    // Mark as processed
    await query('UPDATE rss_items SET is_processed = 1 WHERE id = ?', [id]);

    // Trigger Orchestrator
    const result = await orchestrator.generateCompleteNewsPackage({
      topic: `${item.title}: ${item.summary || ''}`,
      categoryId: 1,
      language: 'hi',
      isBreaking: false,
      authorId: 1
    });

    return res.json({
      success: true,
      message: 'RSS story converted into verified news package!',
      result
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
