'use client';

import BookList from '@/components/BookList';

// このファイルには、不要なモックデータやPrisma関連のコードは一切含まれていません。
// Vercelに新しいファイルとして認識させるための変更（コメント追加）
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="pt-8 pb-12">
        {/* BookListコンポーネントが本のリスト表示と検索を担当します */}
        <BookList />
      </div>
    </main>
  );
}