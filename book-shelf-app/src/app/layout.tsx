// book-shelf-app/src/app/layout.tsx

import '../../app/styles.css'; 
import './globals.css'; 

import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 必須の<html>タグと<body>タグ
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}