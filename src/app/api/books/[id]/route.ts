import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// PrismaClientの初期化 (Next.jsのベストプラクティス: 開発環境でグローバルキャッシュ)
// @ts-ignore
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    global.prisma = prisma;
}

interface Context {
    params: { id: string };
}

// PUT: 本のデータを更新 (管理者機能)
export async function PUT(request: Request, context: Context) {
    const { id } = context.params;
    try {
        const body = await request.json();
        const { shelfNo, title, author, description, status } = body;

        if (!shelfNo || !title) {
            return NextResponse.json({ message: '本棚NOとタイトルは必須項目です' }, { status: 400 });
        }

        const updatedBook = await prisma.book.update({
            where: { id: id },
            data: {
                shelfNo,
                title,
                author,
                description,
                status,
            },
        });

        return NextResponse.json(updatedBook);
    } catch (error) {
        console.error(`Error updating book with ID ${id}:`, error);
        return NextResponse.json({ message: `指定された本 (${id}) が見つからないか、更新に失敗しました` }, { status: 404 });
    }
}

// DELETE: 本のデータを削除 (管理者機能)
export async function DELETE(request: Request, context: Context) {
    const { id } = context.params;
    try {
        await prisma.book.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: '本が正常に削除されました' }, { status: 200 });
    } catch (error) {
        console.error(`Error deleting book with ID ${id}:`, error);
        return NextResponse.json({ message: `指定された本 (${id}) が見つからないか、削除に失敗しました` }, { status: 404 });
    }
}
