const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 10
});

async function initDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS KodUser (
        uid VARCHAR(36) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        balance DECIMAL(15, 2) DEFAULT 100000.00,
        phone VARCHAR(20),
        role ENUM('customer', 'manager', 'admin') DEFAULT 'customer'
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS UserToken (
        tid INT AUTO_INCREMENT PRIMARY KEY,
        token TEXT NOT NULL,
        uid VARCHAR(36) NOT NULL,
        expairy DATETIME NOT NULL,
        FOREIGN KEY (uid) REFERENCES KodUser(uid) ON DELETE CASCADE
      )
    `);

    console.log('Database tables initialized successfully');
  } finally {
    connection.release();
  }
}

module.exports = { pool, initDatabase };
