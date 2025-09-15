// src/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../config/env.config';
import * as schema from './schemas/schema';

// Create PostgreSQL client
const client = postgres(config.DATABASE_URL, {
  max: 10,            // optional: max connections
  idle_timeout: 30,   // optional: seconds before idle connections are closed
});

// Create Drizzle instance
export const db = drizzle(client, { schema, logger: true });

// Export type for typed queries
export type Database = typeof db;
