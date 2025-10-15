// src/app/api/init/route.ts
import { NextResponse } from 'next/server';
import { initBooksTable } from '@/lib/db';

// GET /api/init でアクセスされたときに実行され、テーブルを作成します
export async function GET() {
  try {
    await initBooksTable();
    return NextResponse.json({ message: 'Database initialization successful: books table created/verified.' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Database initialization failed. Check connection string.' }, { status: 500 });
  }
}