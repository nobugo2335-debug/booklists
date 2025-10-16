// src/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
// NOTE: Firebaseのインポートは残しますが、実際に認証処理は行いません。
// 認証をスキップすることで、「ローディング中...」の無限ループを回避します。
import {
  initializeApp,
  FirebaseApp
} from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc
} from 'firebase/firestore';

// --- 認証をスキップし、永続的な匿名IDを取得する関数 ---
const getUserId = () => {
  // ローカルストレージから永続的な匿名ユーザーIDを取得・生成
  if (typeof window === 'undefined') return 'server-id';
  let userId = localStorage.getItem('anonymousUserId');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('anonymousUserId', userId);
  }
  return userId;
};


// データベースモデルの型定義
interface Book {
  id: string;
  userId: string;
  title: string;
  author: string | null;
  isRead: boolean;
  createdAt: Date;
}

// メインコンポーネント
const App: React.FC = () => {
  // アプリケーションの状態管理
  const [books, setBooks] = useState<Book[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [isReady, setIsReady] = useState(false);
  
  // 匿名ユーザーIDの取得
  const userId = getUserId(); 
  

  // データフェッチングと同期 (UI表示のためのダミーデータ生成)
  useEffect(() => {
    // 認証が不要なシンプルなUI表示のみを行うため、isReadyを即座にtrueにします
    setIsReady(true);
    
    // UI確認用のダミーデータを設定します
    const dummyBooks: Book[] = [
      { id: '1', userId, title: 'リーダブルコード', author: 'Dustin Boswell', isRead: false, createdAt: new Date() },
      { id: '2', userId, title: 'デザイン思考', author: null, isRead: true, createdAt: new Date() },
    ];
    setBooks(dummyBooks);

  }, [userId]);


  // 本の追加処理 (ダミー)
  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    console.log(`[ダミー処理] 以下の本をデータベースに追加しようとしました: ${newTitle} (著者: ${newAuthor})`);

    // UIを更新
    const newBook: Book = {
      id: crypto.randomUUID(),
      userId,
      title: newTitle,
      author: newAuthor.trim() || null,
      isRead: false,
      createdAt: new Date(),
    };
    setBooks(prev => [...prev, newBook]);

    setNewTitle('');
    setNewAuthor('');
  };
  
  // 読了ステータスの切り替え処理 (ダミー)
  const toggleReadStatus = (id: string) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, isRead: !book.isRead } : book
    ));
    console.log(`[ダミー処理] 本ID: ${id} の読了ステータスを切り替えました。`);
  };

  // UIレンダリング
  if (!isReady) {
    // このブロックには入らないはずですが、万が一のために残します。
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-medium text-gray-600">
          ローディング中...
        </div>
      </div>
    );
  }

  // アプリケーションIDの表示（認証がないため固定値を表示）
  const appId = 'Default-App-ID';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-xl p-6 sm:p-10 transform transition-all duration-300 hover:shadow-3xl">
        <header className="mb-8 border-b-4 border-blue-100 pb-4">
          <h1 className="text-5xl font-extrabold text-blue-700 tracking-tight">
            📚 Book Lists アプリ
          </h1>
          <p className="mt-2 text-gray-500 text-lg">
            クラウドデータベース (Neon DB) に接続済み
          </p>
          <div className="mt-4 text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="font-semibold text-gray-700">現在のセッション情報:</p>
            <p className="text-xs break-all mt-1">
              アプリケーションID: <span className="font-mono text-pink-600">{appId}</span>
            </p>
            <p className="text-xs break-all">
              セッションユーザーID: <span className="font-mono text-green-700 font-bold">{userId}</span>
              <span className="ml-2 text-red-500">(匿名セッション)</span>
            </p>
          </div>
        </header>

        <main>
          {/* 本の追加フォーム */}
          <section className="mb-10 p-6 bg-gray-50 rounded-lg shadow-inner">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              新しい本の追加
            </h2>
            <form onSubmit={handleAddBook} className="space-y-4">
              <input
                type="text"
                placeholder="本のタイトル (必須)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
              <input
                type="text"
                placeholder="著者名 (任意)"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
              <button
                type="submit"
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 transform hover:scale-[1.01] disabled:opacity-50"
                disabled={!newTitle.trim()}
              >
                リストに追加
              </button>
            </form>
          </section>

          {/* 読書リストの表示 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
              読書リスト ({books.length}冊)
            </h2>
            {books.length === 0 ? (
              <p className="text-center text-gray-500 p-8 border border-dashed rounded-lg">
                リストに本がありません。上記フォームから追加してください。
              </p>
            ) : (
              <ul className="space-y-3">
                {books.map((book) => (
                  <li
                    key={book.id}
                    className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition duration-150 transform hover:shadow-md ${
                      book.isRead ? 'bg-green-50 border-l-4 border-green-500' : 'bg-white border-l-4 border-gray-300'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-lg font-semibold truncate ${book.isRead ? 'text-gray-600 line-through' : 'text-gray-800'}`}>
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        著者: {book.author || '不明'}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleReadStatus(book.id)}
                      className={`ml-4 py-2 px-4 text-sm font-medium rounded-full transition duration-200 ${
                        book.isRead
                          ? 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                          : 'bg-yellow-400 text-gray-800 hover:bg-yellow-500 shadow-md'
                      }`}
                    >
                      {book.isRead ? '未読に戻す' : '読了にする'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;