// book-shelf-app/lib/db.js

// 🚨 【Codespacesで動作させるための最終回避策】接続URLを直接定義 🚨
// Vercelデプロイ時には、このDATABASE_URL_FIXの行と、
// createPoolの引数を削除し、元の環境変数を使う形に戻す必要があります。
const DATABASE_URL_FIX = "postgresql://neondb_owner:npg_VmP0WUyH8shE@ep-mute-resonance-adw8cjcg-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

import { createPool } from '@vercel/postgres';

// 接続プールの初期化。接続URLを明示的に指定
const sql = createPool({ connectionString: DATABASE_URL_FIX });

const TABLE_NAME = 'books'; 

/**
 * 全ての書籍データをデータベースから取得する関数
 */
export async function getAllBooks() {
  try {
    const { rows } = await sql.query(`SELECT * FROM ${TABLE_NAME} ORDER BY "本棚番号"`);
    return rows;
  } catch (error) {
    console.error('Error fetching books (DB connection failed):', error);
    throw error; // route.jsにエラーを投げる
  }
}