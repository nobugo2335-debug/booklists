// This file prevents the PrismaClient instance from being created multiple times 
// during development/hot-reloading in Next.js.

import { PrismaClient } from '@prisma/client';

// Extend the global object to hold the PrismaClient instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use the existing instance if available, otherwise create a new one
const prisma = global.prisma || new PrismaClient({
  // Log all database queries in the console for debugging
  log: ['query', 'info', 'warn', 'error'],
});

// Cache the PrismaClient instance globally in development environments
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
