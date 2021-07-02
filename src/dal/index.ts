import knex, { Knex } from 'knex';
import { ErrorCode } from '../core/enums/ErrorCodes';
import { GenericError } from '../libs/error';
import { logger } from '../libs/logger';

let _db: Knex | null = null;

export async function initDatabase(config: Knex.Config): Promise<void> {
    try {
        _db = knex(config);
        await _db.raw('SELECT 1+1 AS result');
        logger.info('Database was initialized successfully.');
    } catch (error) {
        logger.error('Database initialization failed.', error);
        process.exit(0);
    }
}

export async function runMigrations(): Promise<void> {
    if (_db) {
        await _db.migrate.latest();
        logger.info('Migrations were run successfully.');
    }
}

export async function runSeeds(): Promise<void> {
    if (_db) {
        await _db.seed.run();
        logger.info('Seeds were run successfully.');
    }
}

export async function destroyConnection(): Promise<void> {
    if (_db) {
        await _db.destroy();
        logger.info('Database connection was destroyed successfully.');
    }
}

export async function execQuerySingle(query: string, data?: Record<string, unknown>): Promise<object | null> {
    if (!_db) {
        throw new GenericError('Database is not connected.', ErrorCode.DATABASE_NOT_CONNECTED);
    }
    let result = null;
    if (data) {
        result = await _db.raw(query, data as unknown as Knex.RawBinding);
    } else {
        result = await _db.raw(query);
    }

    if (result?.rows?.[0]) {
        return result.rows[0];
    }

    return null;
}
