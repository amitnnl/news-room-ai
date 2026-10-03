import express from 'express';
import { query } from '../config/db.js';
import { orchestrator } from '../agents/orchestrator.js';

const router = express.Router();

// GET /api/agents - List configured AI agents
router.get('/', async (req, res) => {
  try {
    const agents = await query('SELECT * FROM ai_agents ORDER BY id ASC');
    return res.json({ success: true, agents });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/agents/one-click-package - The Master Newsroom Pipeline Trigger
router.post('/one-click-package', async (req, res) => {
  try {
    const { topic, categoryId = 1, language = 'hi', isBreaking = false, authorId = 1 } = req.body;

    if (!topic || topic.trim() === '') {
      return res.status(400).json({ success: false, message: 'News topic or raw text is required.' });
    }

    const result = await orchestrator.generateCompleteNewsPackage({
      topic: topic.trim(),
      categoryId: parseInt(categoryId, 10),
      language,
      isBreaking: Boolean(isBreaking),
      authorId: parseInt(authorId, 10)
    });

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/agents/breaking - Dedicated Breaking News Emergency Pipeline
router.post('/breaking', async (req, res) => {
  try {
    const { topic, categoryId = 1, language = 'hi' } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, message: 'Breaking topic is required.' });
    }

    const result = await orchestrator.generateCompleteNewsPackage({
      topic: `[BREAKING ALERT] ${topic.trim()}`,
      categoryId: parseInt(categoryId, 10),
      language,
      isBreaking: true,
      authorId: 1
    });

    return res.json({
      ...result,
      isEmergencyBreaking: true,
      alertMessage: 'Breaking News Package generated and staged for instant approval!'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/agents/tasks - Recent AI task runs
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await query(
      `SELECT t.*, a.name as agent_name 
       FROM ai_tasks t 
       LEFT JOIN ai_agents a ON t.agent_code = a.code 
       ORDER BY t.created_at DESC LIMIT 50`
    );
    return res.json({ success: true, tasks });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
