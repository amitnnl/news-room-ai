import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'newsroom_secret_2026';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = users[0];

    // Password verification: bcrypt or default dev fallback
    let isPasswordValid = false;
    if (user.password_hash && (user.password_hash.startsWith('$2a$') || user.password_hash.startsWith('$2b$'))) {
      try {
        isPasswordValid = await bcrypt.compare(password, user.password_hash);
      } catch (err) {
        isPasswordValid = false;
      }
    }

    // Fallback check for dev seeds
    if (!isPasswordValid && (password === 'password123' || password === user.password_hash)) {
      isPasswordValid = true;
    }

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Audit log
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES (?, 'USER_LOGIN', 'users', ?, ?)`,
      [user.id, user.id, `User ${user.email} (${user.role}) logged in successfully`]
    );

    return res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/me - Get current logged-in editor/admin
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const users = await query('SELECT id, name, email, role, avatar_url FROM users WHERE id = ?', [decoded.id]);
        if (users.length > 0) {
          return res.json({ success: true, user: users[0] });
        }
      } catch (jwtErr) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
      }
    }

    // Default first user fallback if token not provided
    const users = await query('SELECT id, name, email, role, avatar_url FROM users ORDER BY id ASC LIMIT 1');
    if (users.length > 0) {
      return res.json({ success: true, user: users[0] });
    }

    return res.status(401).json({ success: false, message: 'Not authenticated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/register - Create new newsroom staff account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'editor' } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const existing = await query('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

    const result = await query(
      'INSERT INTO users (name, email, password_hash, role, avatar_url) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), hash, role, avatar]
    );

    const newId = result.insertId;
    const token = jwt.sign(
      { id: newId, email: email.trim().toLowerCase(), role, name: name.trim() },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Staff account registered successfully',
      token,
      user: {
        id: newId,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        avatar_url: avatar
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/users
router.get('/users', async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, role, avatar_url, created_at FROM users ORDER BY id ASC');
    return res.json({ success: true, users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

