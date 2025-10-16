// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// グローバルスコープでPrismaClientインスタンスを保持するための宣言
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// データベース接続設定。Next.jsのホットリロード問題対策として、
// 開発環境では既存のインスタンスを再利用する。
// production環境では、常に新しいインスタンスを確保する。
const prisma = global.prisma || new PrismaClient({
  // Vercel (サーバーレス環境) でのタイムアウトを防ぐための設定を追加
  datasources: {
    db: {
      // url: process.env.DATABASE_URL を内部的に使用
      url: process.env.DATABASE_URL + '?pgbouncer=true', // <-- この行を修正
    },
  },
  // ログレベルを設定（クエリやエラーをコンソールに出力）
  log: ['query', 'error', 'warn'],
});

// 開発環境でインスタンスが重複生成されるのを防ぐ
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;
