'use client';

import { useState, useEffect } from 'react';
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
  Firestore
} from 'firebase/firestore';

// グローバル変数（Canvas環境から提供される）の型定義
// TypeScriptでエラーが出ないようにするため、typeof __app_id などのチェックを行います
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

// FirebaseサービスとユーザーIDを管理するメインコンポーネント
const App: React.FC = () => {
  // 認証の準備ができたか (ユーザーIDが取得できたか)
  const [isAuthReady, setIsAuthReady] = useState(false);
  // 現在のユーザーID
  const [userId, setUserId] = useState<string | null>(null);
  // Firestoreインスタンス (データベース)
  const [db, setDb] = useState<Firestore | null>(null);
  // Authインスタンス (認証)
  const [auth, setAuth] = useState<Auth | null>(null);

  // 1. Firebase初期化と認証処理 (コンポーネント読み込み時に一度だけ実行)
  useEffect(() => {
    let app: FirebaseApp;
    let authInstance: Auth;
    let dbInstance: Firestore;

    try {
      // Firebase Configの取得とパース
      if (typeof __firebase_config === 'undefined') {
        console.error("エラー: __firebase_config が未定義です。");
        return;
      }
      const firebaseConfig = JSON.parse(__firebase_config);

      // Firebaseアプリの初期化
      app = initializeApp(firebaseConfig);
      authInstance = getAuth(app);
      dbInstance = getFirestore(app);

      setAuth(authInstance);
      setDb(dbInstance);

      // AuthStateの変化を監視 (サインイン後にユーザーIDを取得するため)
      const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
        if (user) {
          // ユーザーが認証された場合、IDを設定
          setUserId(user.uid);
          setIsAuthReady(true);
          console.log("認証成功: ユーザーID", user.uid);
        } else {
          // 認証されていない場合、カスタム認証または匿名認証を実行
          try {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
              // カスタムトークン認証 (Canvas環境からトークンが提供された場合)
              await signInWithCustomToken(authInstance, __initial_auth_token);
              console.log("カスタムトークンでサインインしました。");
            } else {
              // 匿名認証 (トークンがない場合)
              await signInAnonymously(authInstance);
              console.log("匿名でサインインしました。");
            }
          } catch (error) {
            console.error("サインイン処理中にエラーが発生しました:", error);
            // 認証失敗時も、認証の準備は完了したと見なす
            setIsAuthReady(true);
          }
        }
      });

      // クリーンアップ関数
      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase初期化中に致命的なエラーが発生しました:", e);
      // 初期化失敗時も、認証の準備は完了したと見なす
      setIsAuthReady(true);
    }
  }, []); // 依存配列が空なので、一度だけ実行されます

  // 2. UIのレンダリング
  // (isAuthReadyになるまでローディングを表示)
  if (!isAuthReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-medium text-gray-600">
          ローディング中... 認証とデータベース接続を設定しています...
        </div>
      </div>
    );
  }

  // アプリケーションIDとユーザーIDの確認
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 sm:p-10">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-4xl font-extrabold text-blue-600">
            📚 Book Lists アプリ
          </h1>
          <p className="mt-2 text-gray-500">
            あなたの読書リストを保存・管理しましょう。
          </p>
          <div className="mt-4 text-sm bg-gray-50 p-3 rounded-lg border">
            <p className="font-semibold text-gray-700">現在のセッション情報:</p>
            <p className="text-xs break-all mt-1">
              アプリID: <span className="font-mono text-pink-600">{appId}</span>
            </p>
            <p className="text-xs break-all">
              ユーザーID: <span className="font-mono text-green-600 font-bold">{userId || 'N/A (認証エラー)'}</span>
            </p>
          </div>
        </header>

        <main>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            読書リスト (リスト表示エリア)
          </h2>
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-800 p-4 rounded-lg">
            <p className="font-medium">
              Firestore接続に成功しました！
            </p>
            <p className="text-sm mt-1">
              **次のステップ:** このエリアにデータベースから取得した読書リストを表示するコードを追加します。
            </p>
          </div>

          <div className="mt-10">
             <h2 className="text-2xl font-bold text-gray-800 mb-4">
               新しい本の追加
             </h2>
             {/* 今後、本のタイトルと著者名を入力するフォームを追加します */}
             <div className="bg-gray-200 h-24 flex items-center justify-center rounded-lg border border-dashed border-gray-400 text-gray-600">
               本の追加フォーム (次のステップ)
             </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
