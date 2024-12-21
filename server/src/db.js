import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

export const db = drizzle(
  createClient({
    url: process.env.DATABASE_URL,
  })
);
