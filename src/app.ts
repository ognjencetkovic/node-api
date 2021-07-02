import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './core/config';
import { loadRoutes } from './core/router';
import { initDatabase, runMigrations, runSeeds } from './dal';
import { logger } from './libs/logger';
import { getRandomUuid } from './libs/crypto';

const app = express();
const host = process.env.SERVER_HOST || process.env.host;
const port = process.env.SERVER_PORT || 3001;
const env = process.env.NODE_ENV;

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [``];

// options for cors middleware
const options: cors.CorsOptions = {
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'allowedHeaders',
        'Authorization',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    origin: allowedOrigins,
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

async function run() {
    const corsOpts = cors(options);
    app.options('*', corsOpts);
    app.use(cors(options));
    app.use(
        helmet({
            // options to set helmet
        }),
    );

    app.use(express.json({ limit: `50mb` }));

    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        const trace_id = req.headers[`trace-id`]?.toString() || getRandomUuid();
        res.locals.trace_id = trace_id;
        res.locals.hasError = false;
        res.locals.errors = [];
        next();
    });

    loadRoutes(app);

    initDatabase(config.DB_CONNECTION);

    await runMigrations();
    await runSeeds();

    process.on('uncaughtException', (e) => {
        logger.error(`Uncaught Exception: `, e);
    });

    process.on('unhandledRejection', (e) => {
        logger.error(`Unhandled Rejection: `, e);
    });

    app.listen(port, () => {
        logger.info(`${env} server up and running on ${host}:${port}`);
    });
}

run();
