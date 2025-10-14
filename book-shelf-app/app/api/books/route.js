// book-shelf-app/app/api/books/route.js

import { getAllBooks } from '../../../lib/db'; 
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const books = await getAllBooks();
    return NextResponse.json(books);
  } catch (error) {
    // データベース接続エラーをキャッチし、500エラーを返す
    console.error('API Error fetching books:', error);
    return NextResponse.json(
      { error: 'データベースからのデータ取得中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';