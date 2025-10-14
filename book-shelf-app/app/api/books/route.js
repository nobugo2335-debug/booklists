// book-shelf-app/app/api/books/route.js

// 接続ファイルは2階層上に上がってlibフォルダを見る
import { getAllBooks } from '../../../lib/db'; 
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const books = await getAllBooks();
    
    // データが正常に取得できた場合、200 OKを返す
    return NextResponse.json(books);
  } catch (error) {
    // データベース接続エラーが発生した場合、エラーメッセージを出力
    console.error('API Error fetching books:', error);
    
    // フロントエンドにエラーを返し、フロントエンドがAPIからの応答エラーをスローする
    return NextResponse.json(
      { error: 'データベースからのデータ取得中にエラーが発生しました。' },
      { status: 500 }
    );
  }
}

// Next.jsがキャッシュを無効化するために必須
export const dynamic = 'force-dynamic';