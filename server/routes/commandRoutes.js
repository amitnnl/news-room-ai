import express from 'express';
import { orchestrator } from '../agents/orchestrator.js';
import { query } from '../config/db.js';

const router = express.Router();

// POST /api/command - AI Newsroom Command Center
router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({ success: false, message: 'Command prompt is required.' });
    }

    const lower = prompt.toLowerCase();

    // 1. Create news / story / article
    if (lower.includes('create') || lower.includes('write') || lower.includes('draft') || lower.includes('generate')) {
      const topic = prompt.replace(/(create|write|draft|generate|a news story about|a story on|article about)/gi, '').trim();
      const isBreaking = lower.includes('breaking');
      
      const result = await orchestrator.generateCompleteNewsPackage({
        topic: topic || prompt,
        categoryId: lower.includes('haryana') ? 7 : (lower.includes('tech') ? 3 : 1),
        language: 'hi',
        isBreaking,
        authorId: 1
      });

      return res.json({
        success: true,
        actionType: 'CREATED_ARTICLE',
        message: `Command executed: Generated ${isBreaking ? 'Breaking News' : 'News'} Package for "${topic || prompt}"`,
        articleId: result.articleId,
        data: result
      });
    }

    // 2. Fact check query
    if (lower.includes('fact check') || lower.includes('waiting for fact check') || lower.includes('pending')) {
      const articles = await query(
        `SELECT id, title, status, created_at FROM news_articles WHERE status IN ('under_review', 'fact_check_pending') LIMIT 5`
      );
      return res.json({
        success: true,
        actionType: 'LIST_PENDING',
        message: `Found ${articles.length} articles currently pending fact-checking or editorial review.`,
        articles
      });
    }

    // 3. Trending stories query
    if (lower.includes('trend') || lower.includes('viral')) {
      const trends = await query('SELECT * FROM trending_topics ORDER BY trend_score DESC LIMIT 5');
      return res.json({
        success: true,
        actionType: 'TRENDING_TOPICS',
        message: 'Retrieved top trending topics currently monitored by Bharat Pulse engine.',
        trends
      });
    }

    // 4. Default / General AI instruction
    const fallbackPackage = await orchestrator.generateCompleteNewsPackage({
      topic: prompt,
      categoryId: 1,
      language: 'hi',
      isBreaking: false,
      authorId: 1
    });

    return res.json({
      success: true,
      actionType: 'GENERIC_TASK',
      message: `Processed newsroom command: "${prompt}"`,
      articleId: fallbackPackage.articleId,
      data: fallbackPackage
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
