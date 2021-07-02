import config from '../../../src/core/config';
import { initDatabase, destroyConnection } from '../../../src/dal';
import repositories from '../../../src/dal/repositories';

beforeAll(async () => {
    return initDatabase(config.DB_CONNECTION);
});

afterAll(async () => {
    return destroyConnection();
});

describe(`Test repository roles`, () => {
    test(`Should find user role`, async () => {
        const role = await repositories.roles.findByName(`user`);
        expect(role).toHaveProperty(`role_id`);
        expect(role).toHaveProperty(`name`, `user`);
        expect(role).toHaveProperty(`description`);
        return;
    });

    test(`Should find admin role`, async () => {
        const role = await repositories.roles.findByName(`admin`);
        expect(role).toHaveProperty(`role_id`);
        expect(role).toHaveProperty(`name`, `admin`);
        expect(role).toHaveProperty(`description`);
        return;
    });

    test(`Should return null for nonexisting role`, async () => {
        const role = await repositories.roles.findByName(`test`);
        expect(role).toBeNull();
        return;
    });
});
