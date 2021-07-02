import config from '../../../src/core/config';
import { initDatabase, destroyConnection } from '../../../src/dal';
import repositories from '../../../src/dal/repositories';

const email = `user@example.com`;
const pass = `pass01`;

beforeAll(async () => {
    return initDatabase(config.DB_CONNECTION);
});

afterAll(async () => {
    return destroyConnection();
});

describe(`Test repository users`, () => {
    test(`Should successfully create user`, async () => {
        const role = await repositories.roles.findByName(`user`);
        if (!role) {
            throw new Error(`role not found`);
        }
        const user = await repositories.users.register(email, pass, role.role_id);
        expect(user).toHaveProperty(`user_id`);
        expect(user).toHaveProperty(`email`, email);
        expect(user).toHaveProperty(`roles`);
        expect(user).not.toHaveProperty(`password`);
    });

    test(`Should find user by email`, async () => {
        const user = await repositories.users.findByEmail(email);
        expect(user).toHaveProperty(`user_id`);
        expect(user).toHaveProperty(`email`, email);
        expect(user).toHaveProperty(`roles`);
        expect(user).not.toHaveProperty(`password`);
    });

    test(`Should return null for nonexisting user`, async () => {
        const user = await repositories.users.findByEmail(`test@example.com`);
        expect(user).toBeNull();
    });
});
