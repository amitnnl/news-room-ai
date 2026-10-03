import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// GET /api/calendar - Get all scheduled items
router.get('/', async (req, res) => {
  try {
    const calendarEvents = await query(
      `SELECT * FROM content_calendar ORDER BY scheduled_time ASC`
    );

    // Also get scheduled articles and social posts
    const scheduledArticles = await query(
      `SELECT id, title, 'website' as platform, 'article' as event_type, updated_at as scheduled_time, status
       FROM news_articles 
       WHERE status = 'scheduled'
       ORDER BY updated_at ASC`
    );

    const scheduledSocial = await query(
      `SELECT id, headline as title, platform, 'social_post' as event_type, scheduled_at as scheduled_time, status
       FROM social_posts 
       WHERE status = 'scheduled'
       ORDER BY scheduled_at ASC`
    );

    const merged = [...calendarEvents, ...scheduledArticles, ...scheduledSocial];
    return res.json({ success: true, events: merged });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/calendar/reschedule
router.post('/reschedule', async (req, res) => {
  try {
    const { id, eventType, newScheduledTime } = req.body;
    if (!id || !newScheduledTime) {
      return res.status(400).json({ success: false, message: 'ID and new scheduled time are required' });
    }

    if (eventType === 'social_post') {
      await query('UPDATE social_posts SET scheduled_at = ? WHERE id = ?', [newScheduledTime, id]);
    } else if (eventType === 'article') {
      await query('UPDATE content_calendar SET scheduled_time = ? WHERE reference_id = ?', [newScheduledTime, id]);
    } else {
      await query('UPDATE content_calendar SET scheduled_time = ? WHERE id = ?', [newScheduledTime, id]);
    }

    return res.json({ success: true, message: `Rescheduled to ${newScheduledTime}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
