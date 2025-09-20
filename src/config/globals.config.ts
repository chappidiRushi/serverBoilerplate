import z from 'zod';
import { db, type Database } from '../db/connection';
import { err } from '../utils/errors.util';
import { config } from './env.config';
declare global {
  // Add all your globals here
  var APP_CONFIG: typeof config;
  var CE: typeof err;
  var db: Database;
    type DT<T extends z.ZodTypeAny> =
      z.infer<T> extends { data: infer D } ? D : never;

    type DTP<T extends Promise<{ data: any }>> =
      T extends Promise<{ data: infer D }> ? D : never;
}

global.APP_CONFIG = config;
global.CE = err;
global.db = db

export { };
