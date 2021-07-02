import { logger } from './logger';

export class GenericError extends Error {
    code?: number;
    data?: object;

    constructor(message: string, code?: number, data?: object) {
        super(message);
        this.code = code;
        this.data = data;
        logger.error(message, { code, data });
    }
}

export class UnauthorizedError extends GenericError {
    constructor(message?: string, code?: number) {
        super(message || `Unauthorized.`, code);
    }
}

export class ForbiddenError extends GenericError {
    constructor(message?: string, code?: number) {
        super(message || `Forbidden.`, code);
    }
}
export class NotFoundError extends GenericError {
    constructor(message: string, code?: number) {
        super(message, code);
    }
}

export class UserCredentialsError extends GenericError {
    constructor(code?: number) {
        super(`User credentials invalid.`, code);
    }
}
