import { config } from './env';

declare global {
  // Add all your globals here
  var APP_CONFIG: typeof config;
}

global.APP_CONFIG = config;



