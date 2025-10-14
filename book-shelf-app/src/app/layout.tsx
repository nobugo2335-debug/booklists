// book-shelf-app/src/app/layout.tsx

// 以前追加したCSSのインポート
import '../../app/styles.css'; 
import './globals.css'; 

import React from 'react';

// childrenを受け取るシンプルなコンポーネント
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 必須の<html>タグと<body>タグを最小限のコードで実装
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}