import winston from 'winston';
import { config } from '../config/env';

// Log level emojis for development mode
const logEmojis = {
  error: '❌',
  warn: '⚠️',
  info: 'ℹ️',
  debug: '🐛'
};

// Development format with colors and emojis
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const emoji = logEmojis[level.replace(/\u001b\[[0-9;]*m/g, '') as keyof typeof logEmojis] || 'ℹ️';
    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${emoji} ${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

// Production format (clean, structured)
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: config.NODE_ENV === 'development' ? developmentFormat : productionFormat,
  transports: [
    new winston.transports.Console({
      format: config.NODE_ENV === 'development' ? developmentFormat : productionFormat
    })
  ]
});

// Handle uncaught exceptions and unhandled rejections
logger.exceptions.handle(
  new winston.transports.Console()
);

logger.rejections.handle(
  new winston.transports.Console()
);