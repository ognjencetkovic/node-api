import repositories from '../../src/dal/repositories';
import bl from '../../src/bl';
import * as crypto from '../../src/libs/crypto';

const email = `test@example.com`;
const pass = `pass01`;

describe(`Test bl auth`, () => {
    test(`Should successfully register user`, async () => {
        const role = { role_id: `user-role`, name: `user` };
        repositories.users.findByEmail = jest.fn(async () => null);
        repositories.roles.findByName = jest.fn(async () => role);
        repositories.users.register = jest.fn(async (email) => ({
            user_id: `test-user`,
            email,
            roles: [role],
            permissions: [],
        }));
        repositories.refreshTokens.create = jest.fn(async () => ({ token: `test-token`, user_id: `test` }));

        jest.spyOn(crypto, 'saltHashPassword').mockImplementation(() => 'test');

        const response = await bl.auth.register(email, pass, `test_session`);

        expect(response).toHaveProperty(`access_token`);
        expect(response).toHaveProperty(`refresh_token`);
    });

    test(`Should throw an error for existing user`, async () => {
        const role = { role_id: `user-role`, name: `user` };
        repositories.users.findByEmail = jest.fn(async (email: string) => ({
            user_id: `test-user`,
            email,
            roles: [role],
            permissions: [],
        }));

        await expect(bl.auth.register(email, pass, `test_session`)).rejects.toThrow('User already exists');
    });

    test(`Should throw an error if role does not exist`, async () => {
        repositories.users.findByEmail = jest.fn(async () => null);
        repositories.roles.findByName = jest.fn(async () => null);

        await expect(bl.auth.register(email, pass, `test_session`)).rejects.toThrow('Role user not found.');
    });
});
