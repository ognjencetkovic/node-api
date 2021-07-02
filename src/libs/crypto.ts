import crypto from 'crypto';
import config from '../core/config';

export function getRandomString(length: number): string {
    return crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
}

export function sha512(password: string, salt: string): string {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return value;
}

export function saltHashPassword(password: string): string {
    const salt = getRandomString(config.CRYPTO.saltLength);
    const hash = sha512(password, salt);
    return `${hash}:${salt}`;
}

export function validatePassword(password: string, hashSalt: string): boolean {
    const [hash, salt] = hashSalt.split(`:`);
    const passwordHash = sha512(password, salt);
    return passwordHash === hash;
}

export function getRandomUuid(): string {
    return crypto.randomUUID();
}
