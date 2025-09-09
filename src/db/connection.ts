// src/db/index.ts
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { config } from '../config/env';
import * as schema from './schema';
import * as relations from './relations';

// Create PostgreSQL client
const client = postgres(config.DATABASE_URL, {
  max: 10,            // optional: max connections
  idle_timeout: 30,   // optional: seconds before idle connections are closed
});

// Create Drizzle instance
export const db = drizzle(client, { schema, logger: true });

// Export type for typed queries
export type Database = typeof db;
