// src/app/api/books/route.ts
import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

// POST/PUTで受け取るデータのスキーマ
const BookSchema = z.object({
  id: z.number().optional(),
  タイトル: z.string().min(1, 'タイトルは必須です。'),
  著者: z.string().nullable().default(null),
  内容: z.string().nullable().default(null),
  ステータス: z.enum(['〇', '貸出中']).default('〇'),
  本棚番号: z.string().min(1, '本棚番号は必須です。'),
});

// GET: 本のリストをすべて取得
export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM books ORDER BY id DESC;`;
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('データベース取得エラー:', error);
    return NextResponse.json({ error: '本のリストを取得できませんでした。' }, { status: 500 });
  }
}

// POST: 新しい本を登録
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = BookSchema.omit({ id: true }).safeParse(body);

    if (!parsedBody.success) {
      console.error('入力バリデーションエラー:', parsedBody.error.flatten().fieldErrors);
      return NextResponse.json({ error: '入力データが無効です。', details: parsedBody.error.flatten() }, { status: 400 });
    }

    const { タイトル, 著者, 内容, ステータス, 本棚番号 } = parsedBody.data;

    const result = await sql`
      INSERT INTO books (タイトル, 著者, 内容, ステータス, 本棚番号)
      VALUES (${タイトル}, ${著者}, ${内容}, ${ステータス}, ${本棚番号})
      RETURNING *;
    `;

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('データベース挿入エラー:', error);
    return NextResponse.json({ error: '本の登録に失敗しました。' }, { status: 500 });
  }
}