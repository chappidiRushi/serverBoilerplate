import winston from 'winston';
import { config } from './env.config';

const logSymbols: Record<string, string> = {
  error: '❌',
  warn: '⚠️',
  info: 'ℹ️',
  debug: '🐛'
};

const simpleFormat = winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
  const symbol = logSymbols[level] || '';
  const metaStr = Object.keys(meta).length ? ` | ${JSON.stringify(meta, null, 2)}` : '';
  const stackStr = stack ? `\n${stack}` : '';
  return `${symbol} [${timestamp}] ${level}: ${message}${metaStr}${stackStr}`;
});

const format =
  config.NODE_ENV === 'development'
    ? winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      simpleFormat
    )
    : winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    );

export const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format,
  transports: [new winston.transports.Console()]
});

logger.exceptions.handle(new winston.transports.Console());
logger.rejections.handle(new winston.transports.Console());
