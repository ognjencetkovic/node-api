import path from 'path';

export default {
    DB_CONNECTION: {
        client: 'pg',
        connection: {
            host: process.env.POSTGRE_HOST,
            user: process.env.POSTGRE_USER,
            password: process.env.POSTGRE_PASSWORD,
            database: process.env.POSTGRE_DB,
            port: process.env.POSTGRE_PORT ? parseInt(process.env.POSTGRE_PORT, 10) : 5432,
        },
        seeds: {
            directory: path.resolve(__dirname, '../dal/seeds'),
        },
        migrations: {
            directory: path.resolve(__dirname, '../dal/migrations'),
        },
    },
    CRYPTO: {
        saltLength: process.env.SALT_LENGTH ? parseInt(process.env.SALT_LENGTH, 10) : 16,
    },
    JWT: {
        secret: process.env.JWT_SECRET || ``,
        expiresIn: process.env.JWT_EXPIRES_IN || `2h`,
    },
};
