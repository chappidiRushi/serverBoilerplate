import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from '../config/env';
import * as schema from './schema';

// Create PostgreSQL connection
const client = postgres(config.DATABASE_URL);

// Create Drizzle instance
export const db = drizzle(client, { schema });

// Export types
export type Database = typeof db;