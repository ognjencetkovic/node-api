import { getRandomString } from '../../src/libs/crypto';

describe(`Test libs crypto`, () => {
    test(`Should return random string`, async () => {
        expect(getRandomString(16)).toHaveLength(16);
    });
});
