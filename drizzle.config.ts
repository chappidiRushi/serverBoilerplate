import { defineConfig } from 'drizzle-kit';
import { config } from './src/config/env';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});