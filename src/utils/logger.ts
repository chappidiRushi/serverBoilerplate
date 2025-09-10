import winston from 'winston';
import { config } from '../config/env';

const logSymbols: Record<string, string> = {
  error: '❌',
  warn: '⚠️',
  info: 'ℹ️',
  debug: '🐛'
};

const simpleFormat = winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
  const symbol = logSymbols[level] || '';
  const metaStr = Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
  const stackStr = stack ? `\n${stack}` : '';
  return `${symbol} [${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}${stackStr}`;
});

const format =
  config.NODE_ENV === 'development'
    ? winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        simpleFormat
      )
    : winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      );

export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format,
  transports: [new winston.transports.Console()]
});

logger.exceptions.handle(new winston.transports.Console());
logger.rejections.handle(new winston.transports.Console());
