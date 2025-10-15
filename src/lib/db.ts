// src/lib/db.ts
import { Pool, QueryResult } from 'pg';

// 1. 接続プールの設定
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables. Check .env.local.');
}

const pool = new Pool({
  connectionString: connectionString,
});

// 2. クエリ実行関数
// 任意のSQL文を実行し、結果を返します
export async function query<T>(text: string, params?: any[]): Promise<QueryResult<T>> {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
}

// 3. 本のテーブル作成（スキーマ定義）関数
export async function initBooksTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      author VARCHAR(255) NOT NULL,
      isbn VARCHAR(20) UNIQUE,
      published_year INTEGER
    );
  `;
  
  try {
    await pool.query(createTableQuery);
    console.log("Books table ensured.");
  } catch (error) {
    console.error("Error creating books table:", error);
    throw error;
  }
}