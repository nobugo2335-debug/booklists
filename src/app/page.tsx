// src/app/page.tsx
import BookListWrapper from '@/components/BookList';
import { Suspense } from 'react';

// Next.jsのServer Componentとして機能
// ページ全体に必要なデータをロードし、クライアントコンポーネントをラップします。

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-indigo-600 pb-2">
          私の読書記録
        </h1>

        {/* BookListWrapperは、フォーム（BookForm）とリスト（BookList）の両方を内包し、
          編集状態を管理するクライアントコンポーネントです。
        */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">本の登録とリスト</h2>
          
          {/* リスト表示のためのデータ取得は時間がかかる可能性があるため、Suspenseでラップします。
            このサスペンスは、データの読み込み中にローディングメッセージを表示します。
            BookListWrapper内でデータフェッチが行われるため、クライアント側でのローディング表示として機能します。
          */}
          <Suspense fallback={
            <div className="text-center p-10 bg-white rounded-xl shadow-md">
              <p className="text-lg text-gray-500">データを読み込み中...</p>
            </div>
          }>
            <BookListWrapper />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
