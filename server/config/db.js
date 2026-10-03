import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const isCloudHost = process.env.DB_HOST && process.env.DB_HOST !== '127.0.0.1' && process.env.DB_HOST !== 'localhost';
const ssl = (process.env.DB_SSL === 'true' || (isCloudHost && process.env.DB_SSL !== 'false')) 
  ? { rejectUnauthorized: false } 
  : undefined;

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'social_news_agents',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  charset: 'utf8mb4',
  ...(ssl ? { ssl } : {})
});

export async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('MySQL Query Error:', error.message, 'SQL:', sql);
    throw error;
  }
}

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'social_news_agents');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to MySQL database:', error.message);
    return false;
  }
}

export default {
  pool,
  query,
  testConnection
};
