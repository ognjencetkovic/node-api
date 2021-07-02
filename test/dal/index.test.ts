import { destroyConnection, execQuerySingle } from '../../src/dal';
import config from '../../src/core/config';
import { initDatabase } from '../../src/dal';

beforeAll(async () => {
    return initDatabase(config.DB_CONNECTION);
});

afterAll(async () => {
    return destroyConnection();
});

describe(`Should throw exception if incorrect config is passed`, () => {
    test.skip(`Should return ok`, async () => {
        const testConfig = config.DB_CONNECTION;
        testConfig.connection.database = `test-error`;
        jest.spyOn(process, 'exit').mockImplementation();
        await initDatabase(testConfig);
        expect(process.exit).toBeCalled();
    });
});

describe(`Test database connection`, () => {
    test(`Should return ok`, async () => {
        expect(await execQuerySingle(`SELECT 1+1 as result`)).toStrictEqual({ result: 2 });
    });
});
