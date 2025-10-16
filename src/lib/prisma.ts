// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// グローバルスコープでPrismaClientインスタンスを保持するための宣言
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// データベース接続設定。Next.jsのホットリロード問題対策として、
// 開発環境では既存のインスタンスを再利用する。
const prisma = global.prisma || new PrismaClient({
  // Vercel (サーバーレス環境) でのタイムアウトを防ぐための PgBouncer 設定を適用
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?pgbouncer=true',
    },
  },
  // ログレベルを設定
  log: ['error'], // エラーのみをログに出力
});

// 開発環境でインスタンスが重複生成されるのを防ぐ
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;