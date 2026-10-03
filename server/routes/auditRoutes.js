import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// GET /api/audit
router.get('/', async (req, res) => {
  try {
    const logs = await query(
      `SELECT al.*, u.name as user_name, u.email as user_email, u.role as user_role
       FROM audit_logs al
       LEFT JOIN users u ON al.user_id = u.id
       ORDER BY al.created_at DESC LIMIT 100`
    );
    return res.json({ success: true, logs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
