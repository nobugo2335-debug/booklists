// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  // Vercel (サーバーレス環境) での PgBouncer 設定を適用
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '?pgbouncer=true',
    },
  },
  log: ['error'],
});

// 開発環境でインスタンスが重複生成されるのを防ぐ
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export default prisma;