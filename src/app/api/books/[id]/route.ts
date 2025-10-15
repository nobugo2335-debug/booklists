// src/app/api/books/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

// データベース設定は環境変数から取得することを想定
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * UTILITY: エラー処理を共通化
 * @param error - 捕捉されたエラーオブジェクト
 * @returns {string} - エラーメッセージ
 */
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Next.jsの警告メッセージを避けるため、paramsの直接使用に関するエラーは特別に処理
    if (typeof error.message === 'string' && error.message.includes('sync-dynamic-apis')) {
        // データベースエラーがより重要なので、警告は無視し、真のDBエラーに集中
        return error.message; 
    }
    return error.message;
  }
  // ECONNREFUSEDのような詳細情報を含むエラーに対応
  if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'ECONNREFUSED') {
    return 'Database connection refused. Please ensure your PostgreSQL database is running and the DATABASE_URL is correct.';
  }
  return 'An unknown error occurred';
};


// --------------------------------------------------------------------------
// GET (READ): 特定のIDの本を取得
// --------------------------------------------------------------------------
export async function GET(
  request: NextRequest,
  // Next.jsの仕様変更に対応するため、paramsは引数で受け取る
  { params }: { params: { id: string } } 
) {
  // paramsオブジェクトからidを安全に取得
  const id = params.id;
  
  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`Error reading book ID ${id}:`, errorMessage);
    return NextResponse.json({ error: 'Failed to read book', details: errorMessage }, { status: 500 });
  }
}


// --------------------------------------------------------------------------
// PUT (UPDATE): 特定のIDの本を更新
// --------------------------------------------------------------------------
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const { タイトル, 著者, 内容, ステータス, 本棚番号 } = await request.json();
    
    if (!タイトル || !著者) {
      return NextResponse.json({ error: 'Title and Author are required' }, { status: 400 });
    }

    const updateQuery = `
      UPDATE books 
      SET 
        タイトル = $1, 
        著者 = $2, 
        内容 = $3, 
        ステータス = $4, 
        本棚番号 = $5 
        -- 更新日時 = NOW() はテーブルに列がないため削除
      WHERE id = $6 
      RETURNING *;
    `;
    
    // パラメータリストから更新日時を削除
    const result = await pool.query(updateQuery, [タイトル, 著者, 内容, ステータス, 本棚番号, id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Book not found for update' }, { status: 404 });
    }

    console.log(`Book ID ${id} updated successfully.`);
    return NextResponse.json(result.rows[0], { status: 200 }); // 200 OK
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`Error updating book ID ${id}:`, errorMessage);
    return NextResponse.json({ error: 'Failed to update book', details: errorMessage }, { status: 500 });
  }
}


// --------------------------------------------------------------------------
// DELETE (削除): 特定のIDの本を削除
// --------------------------------------------------------------------------
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // paramsオブジェクトからidを安全に取得
  const id = params.id;
  
  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }
  
  try {
    // SQLクエリで削除を実行
    const result = await pool.query(
      'DELETE FROM books WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Book not found for deletion' }, { status: 404 });
    }

    console.log(`Book ID ${id} deleted successfully.`);
    return new NextResponse(null, { status: 204 }); // 204 No Content
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(`Error deleting book ID ${id}:`, errorMessage);
    return NextResponse.json({ error: 'Failed to delete book', details: errorMessage }, { status: 500 });
  }
}
