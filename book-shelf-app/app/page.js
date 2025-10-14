// book-shelf-app/app/page.js

'use client'; 

import React, { useState, useEffect, useMemo } from 'react';

// ステータスに基づくCSSクラスの決定
const getStatusClass = (status) => {
    if (status === 'あり' || status === '利用可能') return 'status-available'; 
    if (status === '貸出中') return 'status-borrowed'; 
    return 'status-unknown';
};

// 書籍アイテム表示用コンポーネント
function BookItem({ book }) {
    const title = book['タイトル'] || 'タイトル不明';
    const author = book['著者'] || '著者不明';
    const status = book['ステータス'] || '不明';
    const returnDate = book['返却予定日'] ? String(book['返却予定日']).split('T')[0] : ''; 
    const shelfNumber = book['本棚番号'] || '不明'; 
    const content = book['内容'] || '';

    const statusClass = getStatusClass(status);
    const isBorrowed = statusClass === 'status-borrowed';

    return (
        <div className="book-item">
            <h2>{title}</h2>
            <p>著者: {author}</p>
            <p>本棚番号: <strong>{shelfNumber}</strong></p>
            <p>ステータス: <span className={`status ${statusClass}`}>{status}</span></p>
            {isBorrowed && returnDate && (
                <p>返却予定日: <strong>{returnDate}</strong></p>
            )}
            {content && <p>内容: {content}</p>}
        </div>
    );
}

export default function BookListApp() {
    const [allBooks, setAllBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentShelfFilter, setCurrentShelfFilter] = useState(null);

    // データ取得関数
    const fetchBookList = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/books'); 
            if (!response.ok) {
                throw new Error('APIからの応答エラー。');
            }
            const books = await response.json();
            setAllBooks(books);
        } catch (err) {
            console.error(err);
            setError('データの取得に失敗しました。DB接続またはAPIコードを確認してください。');
        } finally {
            setIsLoading(false);
        }
    };

    // 初期ロードとURLパラメータの処理
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setCurrentShelfFilter(params.get('shelf')); 
        fetchBookList();
    }, []);

    // フィルタリングと検索のロジック
    const booksToDisplay = useMemo(() => {
        let filtered = allBooks;

        if (currentShelfFilter) {
            filtered = filtered.filter(book => 
                String(book['本棚番号']).toLowerCase() === currentShelfFilter.toLowerCase()
            );
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(book => 
                (book['タイトル'] && String(book['タイトル']).toLowerCase().includes(searchLower)) ||
                (book['著者'] && String(book['著者']).toLowerCase().includes(searchLower)) ||
                (book['本棚番号'] && String(book['本棚番号']).toLowerCase().includes(searchLower)) 
            );
        }
        return filtered;
    }, [allBooks, currentShelfFilter, searchTerm]);

    // 画面のレンダリング
    return (
        <div className="container">
            <h1>📚 フリー本棚 貸出リスト 📚</h1> 

            {currentShelfFilter && (
                <div className="shelf-filter-info">
                    本棚番号: {currentShelfFilter} のリストを表示中
                </div>
            )}
            
            <div className="search-box"> 
                <input 
                    type="text" 
                    id="searchInput" 
                    placeholder="本のタイトル、著者、本棚番号で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setSearchTerm(searchTerm)}>検索</button> 
            </div>

            <div className="book-list" id="bookList"> 
                {isLoading && <div className="no-results">本のリストを読み込み中...</div>}
                {error && <div className="no-results">{error}</div>}
                {/* エラーの原因となっていたコメントを削除し、安全な形式に修正 */}
                {!isLoading && !error && booksToDisplay.length === 0 && (
                    <div className="no-results">現在、表示できる本はありません。</div>
                )}
                
                {booksToDisplay.map(book => (
                    // データベースの id を key に使用
                    <BookItem key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
}