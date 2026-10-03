import express from 'express';
import { query } from '../config/db.js';
import { orchestrator } from '../agents/orchestrator.js';

const router = express.Router();

// GET /api/trends
router.get('/', async (req, res) => {
  try {
    const trends = await query('SELECT * FROM trending_topics ORDER BY trend_score DESC');
    return res.json({ success: true, trends });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/trends/:id/convert - Convert trend into full news package
router.post('/:id/convert', async (req, res) => {
  try {
    const { id } = req.params;
    const [trend] = await query('SELECT * FROM trending_topics WHERE id = ?', [id]);
    if (!trend) {
      return res.status(404).json({ success: false, message: 'Trending topic not found' });
    }

    await query("UPDATE trending_topics SET status = 'in_progress' WHERE id = ?", [id]);

    const result = await orchestrator.generateCompleteNewsPackage({
      topic: trend.topic,
      categoryId: 1,
      language: 'hi',
      isBreaking: trend.trend_score >= 90,
      authorId: 1
    });

    await query("UPDATE trending_topics SET status = 'published' WHERE id = ?", [id]);

    return res.json({
      success: true,
      message: 'Trend converted to news package successfully!',
      result
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
