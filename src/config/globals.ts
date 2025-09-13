import { db, type Database } from '../db/connection';
import { err } from '../utils/errors';
import { config } from './env';
declare global {
  // Add all your globals here
  var APP_CONFIG: typeof config;
  var CE: typeof err;
  var db: Database;
}

global.APP_CONFIG = config;
global.CE = err;
global.db = db