const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { randomUUID } = require('crypto');
const { pool, initDatabase } = require('./db');
require('dotenv').config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

initDatabase().catch(console.error);

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, password, email, phone } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, password, and email are required' });
  }

  try {
    const uid = randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO KodUser (uid, username, email, password, phone, role, balance) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [uid, username, email, hashedPassword, phone || null, 'customer', 100000.00]
    );

    res.json({ success: true, message: 'Registration successful' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
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
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const expairy = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await pool.query(
      'INSERT INTO UserToken (token, uid, expairy) VALUES (?, ?, ?)',
      [token, user.uid, expairy]
    );

    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Check balance endpoint
app.get('/api/balance', async (req, res) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await pool.query('SELECT balance FROM KodUser WHERE username = ?', [decoded.username]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ balance: users[0].balance });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Kodbank server running on port ${PORT}`);
});
