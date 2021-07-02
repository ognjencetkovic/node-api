import dotenv from 'dotenv';
dotenv.config();
import knex from 'knex';
import config from './src/core/config';
import { destroyConnection, initDatabase, runMigrations, runSeeds } from './src/dal';

const TEST_DATABASE = `123`;

export async function createMockDatabase(database: string): Promise<void> {
    const c = config.DB_CONNECTION;
    c.connection.database = undefined;

    const db = knex(c);
    await db.raw(`DROP DATABASE IF EXISTS test_imprimo_${database}`);
    await db.raw(`CREATE DATABASE test_imprimo_${database}`);
    c.connection.database = `test_imprimo_${database}`;
    process.env.POSTGRE_DB = `test_imprimo_${database}`;
    await initDatabase(c);
    await runMigrations();
    await runSeeds();
    await destroyConnection();
}

module.exports = async () => {
    await createMockDatabase(TEST_DATABASE);
};
