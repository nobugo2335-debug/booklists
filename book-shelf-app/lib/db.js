// book-shelf-app/lib/db.js

// Vercelデプロイでは環境変数 (DATABASE_URL) が自動的に使用される
import { sql } from '@vercel/postgres';

const db = sql;

const TABLE_NAME = 'books'; 

/**
 * 全ての書籍データをデータベースから取得する関数
 */
export async function getAllBooks() {
  try {
    const { rows } = await db`SELECT * FROM ${TABLE_NAME} ORDER BY "本棚番号"`;
    return rows;
  } catch (error) {
    console.error('Error fetching books (DB connection failed):', error);
    // Vercelに接続エラーを伝える
    throw error;
  }
}