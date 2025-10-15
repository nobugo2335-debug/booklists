import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// PrismaClientの初期化 (Next.jsのベストプラクティス: 開発環境でグローバルキャッシュ)
// @ts-ignore
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    global.prisma = prisma;
}

// GET: 本の一覧を取得 (本棚NOでのフィルタリング可能)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // クエリパラメータから本棚NOを取得
        const shelfNo = searchParams.get('shelfNo');

        const books = await prisma.book.findMany({
            where: {
                // shelfNoが指定されていれば、その本棚のデータのみを返す
                ...(shelfNo && { shelfNo: shelfNo })
            },
            orderBy: {
                createdAt: 'desc', // 新しいデータ順
            },
        });

        return NextResponse.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        return NextResponse.json({ message: 'データの取得に失敗しました' }, { status: 500 });
    }
}

// POST: 新しい本を登録 (管理者機能)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { shelfNo, title, author, description, status } = body;

        if (!shelfNo || !title) {
            return NextResponse.json({ message: '本棚NOとタイトルは必須項目です' }, { status: 400 });
        }

        const newBook = await prisma.book.create({
            data: {
                shelfNo,
                title,
                author,
                description,
                status: status || 'available', 
            },
        });

        return NextResponse.json(newBook, { status: 201 });
    } catch (error) {
        console.error('Error creating book:', error);
        return NextResponse.json({ message: '本の登録に失敗しました' }, { status: 500 });
    }
}
