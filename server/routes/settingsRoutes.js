import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// GET /api/settings
router.get('/', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM system_settings');
    const settings = {};
    rows.forEach(r => {
      // Mask API keys partially for security
      if (r.setting_key.includes('api_key') || r.setting_key.includes('secret')) {
        const val = r.setting_value || '';
        settings[r.setting_key] = val.length > 8 ? `${val.substring(0, 4)}...${val.substring(val.length - 4)}` : (val ? '******' : '');
        settings[`${r.setting_key}_configured`] = Boolean(val && val.trim() !== '');
      } else {
        settings[r.setting_key] = r.setting_value;
      }
    });
    return res.json({ success: true, settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/settings
router.post('/', async (req, res) => {
  try {
    const updates = req.body; // e.g. { gemini_api_key, openai_api_key, default_ai_provider, daily_budget_usd, ... }

    for (const [key, value] of Object.entries(updates)) {
      if (key.endsWith('_configured')) continue;
      // If key is masked or empty string intended to keep existing, don't overwrite if masked
      if (typeof value === 'string' && value.includes('...')) continue;

      await query(
        `INSERT INTO system_settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, String(value)]
      );
    }

    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES (1, 'SETTINGS_UPDATED', 'system_settings', 1, 'System AI Provider and budget settings updated.')`
    );

    return res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
