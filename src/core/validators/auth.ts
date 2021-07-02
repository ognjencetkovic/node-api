import { NextFunction, Request, Response } from 'express';
import { Role } from '../../dal/models/Role';
import { User } from '../../dal/models/User';
import { UnauthorizedError } from '../../libs/error';
import jwt from '../../libs/jwt';
import config from '../config';
import { ErrorCode } from '../enums/ErrorCodes';

export function noSession(req: Request, res: Response, next: NextFunction): void {
    res.locals.user = { noSession: true };
    next();
}

const authUser = (token: string) => {
    if (!token || !token.includes(`Bearer `)) {
        throw new UnauthorizedError(`You must provide a valid JWT to use this endpoint`, ErrorCode.UNAUTHORIZED);
    }
    return jwt.verify(token.replace(`Bearer `, ``), config.JWT.secret);
};

export function isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization;
    try {
        const decoded = authUser(token || ``);
        res.locals.user = decoded;
        next();
    } catch (error) {
        res.status(401).send(error.message);
    }
}

export function isUser(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization;
    try {
        const decoded = authUser(token || ``) as User;
        if (!decoded?.roles?.some((role: Role) => role.name === `user`)) {
            res.status(403).send(`Forbidden`);
        }
        res.locals.user = decoded;
        next();
    } catch (error) {
        res.status(403).send(error.message);
    }
}

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization;
    try {
        const decoded = authUser(token || ``) as User;
        if (!decoded?.roles?.some((role: Role) => role.name === `admin`)) {
            res.status(403).send(`Forbidden`);
        }
        res.locals.user = decoded;
        next();
    } catch (error) {
        res.status(403).send(error.message);
    }
}
