import * as Winston from 'winston';
import { getCurrentTimestampInUnix } from './date';

const _logger = Winston.createLogger({
    level: process.env.LOG_LEVEL || 'debug',
    format: Winston.format.combine(
        Winston.format.json(),
        Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        Winston.format.colorize({ all: true }),
    ),
    transports: [new Winston.transports.Console()],
    defaultMeta: {
        NODE_ENV: process.env.NODE_ENV,
        SERVER_HOST: process.env.SERVER_HOST,
        HOSTNAME: process.env.HOSTNAME,
        TS: getCurrentTimestampInUnix(),
    },
    silent: false,
    exitOnError: false,
});

export const logger = _logger;
