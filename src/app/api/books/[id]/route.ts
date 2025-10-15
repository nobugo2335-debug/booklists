// このファイルは、/api/books/[id] への PUT (更新) および DELETE (削除) リクエストに応答します。

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // 共通のPrismaインスタンスをインポート

// Next.jsの動的ルートから渡されるパラメータの型定義
interface Context {
    params: { id: string }; // URLパスから渡されるIDパラメータ (例: /api/books/clxzyv...)
}

// PUT: 特定の本のデータを更新 (管理者機能)
// HTTP PATCHリクエストも使用可能ですが、ここでは標準的なPUTを使用します。
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

        // Prismaで指定されたIDの本を検索し、データを更新
        const updatedBook = await prisma.book.update({
            where: { id: id }, // IDで対象を特定
            data: {
                shelfNo,
                title,
                // author, descriptionはnullを許容
                author,
                description,
                // statusは'available' or 'on_loan'
                status,
            },
        });

        // 成功したデータをJSONレスポンスとして返す
        return NextResponse.json(updatedBook);

    } catch (error) {
        // Prismaのエラーハンドリング
        // P2025 (レコードが見つからない) の場合は404を返すのが一般的ですが、
        // 汎用的なエラーハンドリングとしてここでは404を返します。
        console.error(`Error updating book with ID ${id}:`, error);
        return NextResponse.json({ message: `指定された本 (${id}) が見つからないか、更新に失敗しました` }, { status: 404 });
    }
}

// DELETE: 特定の本のデータを削除 (管理者機能)
export async function DELETE(request: Request, context: Context) {
    const { id } = context.params;
    try {
        // Prismaで指定されたIDの本を削除
        await prisma.book.delete({
            where: { id: id },
        });

        // 削除成功時は内容なしの200 OK（または204 No Content）を返す
        return NextResponse.json({ message: '本が正常に削除されました' }, { status: 200 });
    } catch (error) {
        console.error(`Error deleting book with ID ${id}:`, error);
        // 削除対象が見つからない場合も404を返す
        return NextResponse.json({ message: `指定された本 (${id}) が見つからないか、削除に失敗しました` }, { status: 404 });
    }
}