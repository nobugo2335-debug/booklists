'use client';

// BookListコンポーネントのみをインポートします。
// これにより、以前発生していた型の依存関係エラーを回避します。
import BookList from '@/components/BookList';

// このページは、BookListコンポーネントを表示するだけのシンプルなクライアントコンポーネントです。
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-8 pb-12">
        {/* BookListコンポーネントが本のリスト、検索、管理画面の全機能を担います。 */}
        <BookList />
      </div>
    </main>
  );
}
