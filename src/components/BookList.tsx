'use client';

import React, { useState, useEffect, useMemo, useCallback, FormEvent } from 'react';

// データの型定義 (Prismaモデルに合わせる)
interface Book {
  id: string;
  shelfNo: string;
  title: string;
  author: string | null;
  description: string | null;
  status: 'available' | 'on_loan' | string;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------
// 【修正】インポートエラー回避のため、BookFormをこのファイル内にインラインで定義
// ----------------------------------------------------

interface BookFormProps {
    initialBook?: Book;
    onSave: (book: Book) => Promise<void>;
    onCancel: () => void;
    isSaving: boolean;
}

const BookForm: React.FC<BookFormProps> = ({ initialBook, onSave, onCancel, isSaving }) => {
    const isEdit = !!initialBook;
    const [title, setTitle] = useState(initialBook?.title || '');
    const [author, setAuthor] = useState(initialBook?.author || '');
    const [shelfNo, setShelfNo] = useState(initialBook?.shelfNo || 'SH001');
    const [description, setDescription] = useState(initialBook?.description || '');
    const [status, setStatus] = useState(initialBook?.status || 'available');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // 必須フィールドのチェック
        // Note: window.alert() は推奨されませんが、ここでは簡易的に使用
        if (!title.trim() || !shelfNo.trim()) {
            alert('タイトルと本棚NOは必須です。'); 
            return;
        }

        const bookData: Book = {
            id: initialBook?.id || crypto.randomUUID(),
            shelfNo: shelfNo,
            title: title,
            author: author || null,
            description: description || null,
            status: status,
            // 実際はサーバー側で生成されますが、クライアント側でモックのタイムスタンプを追加
            createdAt: initialBook?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        onSave(bookData);
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-lg w-full transform transition-all scale-100 duration-300">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
                {isEdit ? '本の編集' : '新しい本の登録'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">タイトル <span className="text-red-500">*</span></label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        placeholder="本のタイトル"
                    />
                </div>
                
                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">著者</label>
                    <input
                        id="author"
                        type="text"
                        value={author || ''}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        placeholder="著者名"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="shelfNo" className="block text-sm font-medium text-gray-700 mb-1">本棚NO <span className="text-red-500">*</span></label>
                        <input
                            id="shelfNo"
                            type="text"
                            value={shelfNo}
                            onChange={(e) => setShelfNo(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            placeholder="例: SH001"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-150"
                        >
                            <option value="available">available (利用可能)</option>
                            <option value="on_loan">on_loan (貸出中)</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">内容</label>
                    <textarea
                        id="description"
                        value={description || ''}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 resize-none"
                        placeholder="本の簡単な説明や備考"
                    />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50 transition duration-150"
                        disabled={isSaving}
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-400"
                        disabled={isSaving}
                    >
                        {isSaving ? '保存中...' : (isEdit ? '更新' : '登録')}
                    </button>
                </div>
            </form>
        </div>
    );
};

// ----------------------------------------------------
// BookListコンポーネント本体
// ----------------------------------------------------

// ユーティリティ関数: APIリクエスト
const API_BASE_URL = '/api/books';

const fetchBooks = async (shelfNo?: string): Promise<Book[]> => {
    // Canvas環境には実際のNext.js APIルートが存在しないため、モックデータを使用する
    console.log(`Fetching books from mock API. Filter: ${shelfNo || 'None'}`);
    
    // 実際のAPIロジックはコメントアウトして残しておきます
    /*
    const url = shelfNo ? `${API_BASE_URL}?shelfNo=${shelfNo}` : API_BASE_URL;
    const res = await fetch(url, { cache: 'no-store' }); // Next.js APIを叩く
    if (!res.ok) throw new Error('本のリストの取得に失敗しました');
    return res.json();
    */

    // モックデータフィルタリング
    const mockBooks: Book[] = [
        { id: "mock-1", shelfNo: "SH001", title: "モックブック (利用可能)", author: "ジェミニ", description: "これはモックデータです。実際のDB接続エラーを回避するために使用されています。", status: "available", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "mock-2", shelfNo: "SH002", title: "モックブック (貸出中)", author: "ジェミニ", description: "BookListコンポーネントで表示されることを確認できます。", status: "on_loan", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "mock-3", shelfNo: "SH001", title: "モックブック (新規登録用)", author: "テストユーザー", description: "新規登録はAPI経由で処理されます。", status: "available", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];

    await new Promise(resolve => setTimeout(resolve, 500)); // 擬似的な遅延

    return mockBooks.filter(book => !shelfNo || book.shelfNo === shelfNo);
};

const saveBook = async (book: Partial<Book>): Promise<Book> => {
    console.log("Mock API: Saving book:", book);
    await new Promise(resolve => setTimeout(resolve, 1000)); // 擬似的な遅延
    // 実際にはAPIエンドポイントにPOST/PUTリクエストが行われます
    return book as Book; 
};

const deleteBook = async (id: string): Promise<void> => {
    console.log("Mock API: Deleting book:", id);
    await new Promise(resolve => setTimeout(resolve, 500)); // 擬似的な遅延
    // 実際にはAPIエンドポイントにDELETEリクエストが行われます
};

// ----------------------------------------------------
// BookListコンポーネント
// ----------------------------------------------------

interface BookListProps {
    // 【修正1】initialBooksをオプションに変更
    initialBooks?: Book[]; 
}

const BookList: React.FC<BookListProps> = ({ initialBooks }) => {
  // 【修正2】initialBooksがundefinedの場合に空配列をデフォルト値として使用
  const [books, setBooks] = useState<Book[]>(initialBooks || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // フォーム状態
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);

  // 検索・フィルタリング状態
  const [searchTerm, setSearchTerm] = useState('');
  // QRコードで読み込んだ本棚NOをシミュレートする状態
  const [shelfNoFilter, setShelfNoFilter] = useState(''); 

  // データ取得関数
  const loadBooks = useCallback(async (filterShelfNo?: string) => {
    setLoading(true);
    setError(null);
    try {
        const data = await fetchBooks(filterShelfNo);
        setBooks(data);
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError('データの読み込みに失敗しました');
        }
    } finally {
        setLoading(false);
    }
  }, []);

  // 本棚NOフィルターの変更時にデータを再取得
  useEffect(() => {
    // 初回レンダリング時のみinitialBooksを使用し、その後はloadBooksで管理する
    // ただし、この環境ではinitialBooksもモックのため、loadBooksをトリガーします
    loadBooks(shelfNoFilter);
  }, [loadBooks, shelfNoFilter]);

  // 本棚NOをQRコードで読み込んだことをシミュレートする関数
  const toggleShelfFilter = () => {
    if (shelfNoFilter) {
        // フィルタリング解除
        setShelfNoFilter('');
    } else {
        // QRコードのスキャンをシミュレート (例: SH001, SH002, SH003)
        const randomShelfNo = `SH00${Math.floor(Math.random() * 3) + 1}`;
        setShelfNoFilter(randomShelfNo);
    }
  };

  // 検索窓での検索（タイトル、著者、内容でフィルタリング）
  const filteredBooks = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    // booksは常に配列であることが保証されるため、安全にfilterを呼び出せる
    return books.filter(book => {
      const matchTitle = book.title.toLowerCase().includes(lowerCaseSearchTerm);
      const matchAuthor = book.author?.toLowerCase().includes(lowerCaseSearchTerm);
      const matchDescription = book.description?.toLowerCase().includes(lowerCaseSearchTerm);

      return matchTitle || matchAuthor || matchDescription;
    });
  }, [books, searchTerm]);
  
  // フォーム操作ハンドラ
  const handleOpenForm = (book?: Book) => {
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBook(undefined);
  };

  const handleSave = async (bookData: Book) => {
    setIsSaving(true);
    setError(null);
    try {
        const savedBook = await saveBook(bookData);
        
        // モック応答に基づき、リストを直接更新
        setBooks(prevBooks => {
            if (bookData.id && prevBooks.some(b => b.id === bookData.id)) {
                // 編集
                return prevBooks.map(b => b.id === bookData.id ? savedBook : b);
            } else {
                // 新規登録
                return [savedBook, ...prevBooks];
            }
        });
        
        handleCloseForm();
    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError('本の保存に失敗しました');
        }
    } finally {
        setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    // 削除確認のモーダルをシミュレート
    // Note: window.confirm() は非推奨ですが、ここでは簡易的に使用
    if (!window.confirm('本当にこの本を削除しますか？')) return; 

    setLoading(true);
    setError(null);
    try {
        await deleteBook(id);
        
        // リストから削除
        setBooks(prevBooks => prevBooks.filter(b => b.id !== id));

    } catch (e) {
        if (e instanceof Error) {
            setError(e.message);
        } else {
            setError('本の削除に失敗しました');
        }
    } finally {
        setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    return status === 'available' ? { text: '〇 (利用可能)', color: 'bg-green-100 text-green-800' } : { text: '貸出中', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl font-sans">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 border-b-4 border-indigo-500 pb-3 text-center md:text-left">
            📚 フリー本棚プロジェクト
        </h1>
        
        {/* コントロールパネル */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
            
            {/* 1. 利用者機能: QRシミュレーションと本棚NO表示 */}
            <div className='flex flex-col md:flex-row items-stretch md:items-center space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto'>
                <button 
                    onClick={toggleShelfFilter}
                    className={`p-3 rounded-xl shadow-lg transition duration-200 text-sm font-bold w-full md:w-auto ${
                        shelfNoFilter ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                    } flex items-center justify-center`}
                >
                    {shelfNoFilter ? `本棚NO ${shelfNoFilter} から全件表示に戻す` : '📱 QRコードを読み込む (本棚NOをシミュレート)'}
                </button>
                {shelfNoFilter && (
                    <span className="text-lg font-bold text-indigo-700 bg-indigo-100 p-2 rounded-xl text-center shadow-inner">
                        🎯 現在の表示本棚NO: {shelfNoFilter}
                    </span>
                )}
            </div>
            
            {/* 2. 管理機能: 新規登録ボタン */}
            <div className="flex justify-end w-full md:w-auto">
                <button 
                    onClick={() => handleOpenForm()}
                    className="p-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition duration-200 text-sm font-bold w-full md:w-auto"
                >
                    ＋ 新規の本を登録 (管理者)
                </button>
            </div>
        </div>

        {/* 検索窓 */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="📚 タイトル、著者、内容で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-xl shadow-inner focus:outline-none focus:border-indigo-500 transition duration-200 text-base"
          />
        </div>

        {/* エラーとローディング表示 */}
        {loading && <p className="text-center text-indigo-600 font-bold text-xl my-8">データを読み込み中...</p>}
        {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl my-4 font-bold border-l-4 border-red-500 shadow-md">❌ エラー: {error}</div>}

        {/* フォームモーダル */}
        {isFormOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                <BookForm 
                    initialBook={editingBook}
                    onSave={handleSave}
                    onCancel={handleCloseForm}
                    isSaving={isSaving}
                />
            </div>
        )}

        {/* 本のリストテーブル */}
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">管理ID</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">本棚NO</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">タイトル</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider hidden md:table-cell">著者</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider hidden lg:table-cell">内容</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">ステータス</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">操作 (管理者)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => {
                                const statusInfo = getStatusDisplay(book.status);
                                return (
                                <tr key={book.id} className="hover:bg-indigo-50 transition duration-100">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 max-w-[100px] overflow-hidden text-ellipsis">{book.id.substring(0, 8)}...</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{book.shelfNo}</td>
                                    <td className="px-6 py-4 whitespace-pre-wrap font-bold text-sm text-gray-900 max-w-xs">{book.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{book.author || '不明'}</td>
                                    <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 max-w-sm overflow-hidden text-ellipsis hidden lg:table-cell">{book.description || '概要なし'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${statusInfo.color}`}>
                                            {statusInfo.text.split(' ')[0]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleOpenForm(book)}
                                            className="text-indigo-600 hover:text-indigo-900 transition duration-150 font-semibold"
                                            title="編集"
                                        >
                                            編集
                                        </button>
                                        <button
                                            onClick={() => handleDelete(book.id)}
                                            className="text-red-600 hover:text-red-900 transition duration-150 font-semibold"
                                            title="削除"
                                        >
                                            削除
                                        </button>
                                    </td>
                                </tr>
                            )})
                        ) : (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-lg text-gray-500 font-medium">
                                    {loading ? 'データを読み込み中...' : '該当する本が見つかりませんでした。'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default BookList;
