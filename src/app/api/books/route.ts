// このファイルは、/api/books/[id] への PUT (更新) および DELETE (削除) リクエストに応答します。

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // 共通のPrismaインスタンスをインポート

interface Context {
    params: { id: string }; // URLパスから渡されるIDパラメータ
}

// PUT: 特定の本のデータを更新 (管理者機能)
export async function PUT(request: Request, context: Context) {
    const { id } = context.params;
    try {
        const body = await request.json();
        // 更新に必要なデータ
        const { shelfNo, title, author, description, status } = body;

        // 必須項目チェック（更新時も）
        if (!shelfNo || !title) {
            return NextResponse.json({ message: '本棚NOとタイトルは必須項目です' }, { status: 400 });
        }

        const updatedBook = await prisma.book.update({
            where: { id: id }, // IDで対象を特定
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
        // 更新エラーは、対象の本が見つからない（404）か、DBエラー（500）の可能性が高い
        console.error(`Error updating book with ID ${id}:`, error);
        return NextResponse.json({ message: `指定された本 (${id}) が見つからないか、更新に失敗しました` }, { status: 404 });
    }
}

// DELETE: 特定の本のデータを削除 (管理者機能)
export async function DELETE(request: Request, context: Context) {
    const { id } = context.params;
    try {
        await prisma.book.delete({
            where: { id: id },
        });

        // 削除成功時は内容なしの200 OKを返すことが多い
        return NextResponse.json({ message: '本が正常に削除されました' }, { status: 200 });
    } catch (error) {
        console.error(`Error deleting book with ID ${id}:`, error);
        return NextResponse.json({ message: `指定された本 (${id}) が見つからないか、削除に失敗しました` }, { status: 404 });
    }
}
