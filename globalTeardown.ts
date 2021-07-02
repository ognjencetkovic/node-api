import dotenv from 'dotenv';
dotenv.config();
import knex from 'knex';
import config from './src/core/config';
import { destroyConnection } from './src/dal';

const TEST_DATABASE = `123`;

export async function dropMockDatabase(database: string): Promise<void> {
    destroyConnection();
    const c = config.DB_CONNECTION;
    c.connection.database = undefined;
    const db = knex(c);
    await db.raw(`DROP DATABASE test_${database}`);
}

module.exports = async () => {
    await dropMockDatabase(TEST_DATABASE);
};
