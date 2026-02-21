const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { randomUUID } = require('crypto');
const { pool, initDatabase } = require('../backend/db');

const app = express();

app.use(cors({ 
  origin: true, 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(cookieParser());

// Initialize database on first request
let dbInitialized = false;
app.use(async (req, res, next) => {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }
  next();
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { username, password, email, phone } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Username, password, and email are required' });
    }

    const uid = randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO KodUser (uid, username, email, password, phone, role, balance) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uid, username, email, hashedPassword, phone || null, 'customer', 100000.00]
    );

    return res.status(200).json({ success: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    return res.status(500).json({ error: 'Registration failed', message: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const [users] = await pool.query('SELECT * FROM KodUser WHERE username = ?', [username]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );

    const expairy = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO UserToken (token, uid, expairy) VALUES (?, ?, ?)',
      [token, user.uid, expairy]
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'none', secure: true });
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed', message: error.message });
  }
});

// Check balance endpoint
app.get('/api/balance', async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    const [users] = await pool.query('SELECT balance FROM KodUser WHERE username = ?', [decoded.username]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ balance: users[0].balance });
  } catch (error) {
    console.error('Balance error:', error);
    return res.status(401).json({ error: 'Invalid token', message: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Kodbank API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
