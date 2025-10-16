// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// アプリケーションのメタデータ
export const metadata: Metadata = {
  title: 'フリー本棚プロジェクト - BookLists',
  description: 'Vercel, Next.js, Neon DBで実現する、市民参加型フリーブックシェアサービス',
};

// ルートレイアウトコンポーネント
// ここには認証やデータベース接続のグローバルな処理は一切含めません。
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* children に page.tsx の内容が入ります */}
        {children}
      </body>
    </html>
  );
}
