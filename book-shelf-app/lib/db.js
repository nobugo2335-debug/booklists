// book-shelf-app/lib/db.js

// 🚨 環境変数に戻す - Vercelはこれで動作します 🚨
import { sql } from '@vercel/postgres';

const db = sql;

const TABLE_NAME = 'books'; 

/**
 * 全ての書籍データをデータベースから取得する関数
 */
export async function getAllBooks() {
  try {
    // db`...` は Vercel環境変数 (DATABASE_URL) を自動的に使用します
    const { rows } = await db`SELECT * FROM ${TABLE_NAME} ORDER BY "本棚番号"`;
    return rows;
  } catch (error) {
    console.error('Error fetching books (DB connection failed):', error);
    // エラーを呼び出し元（route.js）に渡す
    throw error;
  }
}