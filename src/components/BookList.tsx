// src/components/BookList.tsx
'use client'; 

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// ★重要: BookFormからBookの型とコンポーネントを正しくインポート
import BookForm, { Book } from './BookForm'; 

const API_URL = '/api/books';

// データ取得ロジック
const fetchBooks = async (): Promise<Book[]> => {
  try {
    // API Routeからデータを取得 (キャッシュ無効化)
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) {
      console.error('APIから本のリストを取得できませんでした。');
      return [];
    }
    return res.json();
  } catch (error) {
    console.error('Fetch中にネットワークエラーが発生しました:', error);
    return [];
  }
};

export default function BookListWrapper() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined); // 編集対象の本

  // 本のリストを再取得するコールバック関数
  const loadBooks = useCallback(async () => {
    setLoading(true);
    const fetchedBooks = await fetchBooks();
    setBooks(fetchedBooks);
    setLoading(false);
  }, []);

  // 初回ロード時とloadBooksが変更されたときに実行
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // 削除処理
  const handleDelete = async (id: number) => {
    if (!window.confirm('本当にこの本を削除しますか？')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        console.log(`本 ID:${id} を正常に削除しました。`);
        // UIを即座に更新 (Stateから削除)
        setBooks(books.filter(book => book.id !== id));
        loadBooks(); // 念のため再ロード
      } else {
        const errorData = await res.json();
        throw new Error(`APIエラー: ${errorData.error || res.statusText}`);
      }
    } catch (error) {
      console.error('削除中にエラーが発生しました:', error);
      window.alert(`削除に失敗しました。\nエラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
  };

  // ローディング表示
  if (loading) {
    return (
      <div className="text-center p-10 text-gray-500">
        <div className="animate-spin inline-block w-8 h-8 border-4 border-t-4 border-blue-500 border-gray-200 rounded-full mb-3"></div>
        <p>データを読み込み中...</p>
      </div>
    );
  }

  // リスト表示セクション
  const listSection = (
    <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-inner mt-6">
      {books.length === 0 ? (
        <p className="text-center py-10 text-gray-500">まだ本が登録されていません。</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">著者</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内容</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">本棚番号</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.タイトル}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.著者 || '-'}</td>
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-xs">{book.内容 || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    book.ステータス === '貸出中' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800' // '〇'の場合
                  }`}>
                    {book.ステータス}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.本棚番号 || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(book)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 rounded-md hover:bg-indigo-50 transition duration-150"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition duration-150"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div>
      {/* BookFormのonSuccessでloadBooksが実行され、リストが更新される */}
      <BookForm 
        initialBook={editingBook} 
        setEditingBook={setEditingBook} 
        onSuccess={loadBooks} 
      />
      {listSection}
    </div>
  );
}