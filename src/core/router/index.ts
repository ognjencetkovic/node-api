/* eslint-disable @typescript-eslint/no-var-requires */
import { Application, Express, NextFunction, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import klawSync from 'klaw-sync';
import { IConfig } from '../interfaces/IConfig';
import { IHandler } from '../interfaces/IHandler';
import { IRoute } from '../interfaces/IRoute';
import { HandlerType } from '../enums/HandlerType';
import { MiddlewareDefaultWeights } from '../enums/MiddlewareDefaultWeights';
import { validateSchema } from '../validators/schema';
import { IResponseObject } from '../interfaces/IResponseObject';
import { GenericError } from '../../libs/error';
import { ErrorCode } from '../enums/ErrorCodes';
import { AuthLevel } from '../enums/AuthLevel';
import { isAdmin, isAuthenticated, isUser, noSession } from '../validators/auth';
import { Permission } from '../../dal/models/Permission';

const loader = (routePath: string, filter: string) => {
    const file = fs.readdirSync(routePath).find((filePath) => filePath.indexOf(filter) !== -1);
    if (!file) {
        return null;
    }
    const fullPath = path.resolve(routePath, file);

    return require(fullPath);
};

const load = () => {
    const basename = path.join(path.resolve(__dirname), `../../endpoints`);
    const paths = klawSync(basename, { nodir: true })
        .map((fileStats) => fileStats.path)
        .filter((filePath) => filePath.indexOf(`config.`) !== -1);

    const routes: IRoute[] = [];
    paths.forEach((filePath) => {
        const route: IConfig = require(filePath).config;
        if (!route) {
            throw new GenericError(`Route cannot be null/undefined: ${filePath}`, ErrorCode.ROUTE_UNDEFINED);
        }
        const callbacks = autoLoad(filePath.replace(`${path.sep}config.ts`, ``).replace(`${path.sep}config.js`, ``));
        routes.push({ ...route, callbacks });
    });

    return routes.sort((x, y) => (x.weight && y.weight ? x.weight - y.weight : -1));
};

const execute = async (req: Request, res: Response, next: NextFunction, cb: Function) => {
    try {
        if (res.locals.hasError) {
            return next();
        }
        const response = await cb(req, res, next);

        res.locals.data = response.data;
        res.locals.status = response.status;

        return next();
    } catch (error) {
        res.locals.hasError = true;
        res.locals.errors = [error];
        return next(false);
    }
};

const getResponseObject = (res: Response): IResponseObject => {
    const response: IResponseObject = {
        success: false,
        trace_id: res.locals.trace_id,
    };
    if (res.locals.hasError) {
        const errors = res.locals.errors?.map((error: GenericError) => ({ message: error.message, code: error.code }));
        response.errors = errors;
        return response;
    }
    response.success = true;
    response.data = res.locals.data;
    return response;
};

const finalCallback = async (req: Request, res: Response): Promise<void> => {
    const status = res.locals.hasError ? 400 : 200;
    res.status(res.locals.status || status).json(getResponseObject(res));
};

const getHandlers = (
    handlerType: HandlerType,
    handler?: Record<string, Function>,
    requiredFunc?: string,
): IHandler | null => {
    if (handlerType === HandlerType.FINAL) {
        return {
            weight: MiddlewareDefaultWeights.FINAL,
            cb: async (req: Request, res: Response) => {
                await finalCallback(req, res);
            },
        };
    }
    if (!handler) {
        return null;
    }
    if (!requiredFunc || !handler[requiredFunc]) {
        throw new GenericError(`Invalid handler, missing func: '${requiredFunc}'`, ErrorCode.HANDLER_NOT_VALID);
    }

    switch (handlerType) {
        case HandlerType.REQUEST_SCHEMA:
            return {
                weight: MiddlewareDefaultWeights.REQUEST_SCHEMA,
                cb: async (req: Request, res: Response, next: NextFunction) => {
                    await validateSchema(req, res, next, req, handler.requestSchema);
                },
            };
        case HandlerType.EXECUTOR:
            return {
                weight: MiddlewareDefaultWeights.EXECUTOR,
                cb: (req: Request, res: Response, next: NextFunction) => {
                    execute(req, res, next, handler[requiredFunc]);
                },
            };
        case HandlerType.RESPONSE_SCHEMA:
            return {
                weight: MiddlewareDefaultWeights.RESPONSE_SCHEMA,
                cb: async (req: Request, res: Response, next: NextFunction) => {
                    await validateSchema(req, res, next, res, handler.responseSchema);
                },
            };
        default:
            throw new GenericError(`Invalid handler type: '${handlerType}'`, ErrorCode.HANDLER_TYPE_NOT_VALID);
    }
};

const getAuthCallback = (authLevel: AuthLevel) => {
    switch (authLevel) {
        case AuthLevel.NO_SESSION:
            return noSession;
        case AuthLevel.ANY_LOGIN:
            return isAuthenticated;
        case AuthLevel.USER_LOGIN:
            return isUser;
        case AuthLevel.ADMIN_LOGIN:
            return isAdmin;
        default:
            break;
    }
};

const getPermissionsCallback = (permission?: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (
            !permission ||
            res.locals.user?.permissions?.some((per: Permission) => per.code === `SU` || per.code === permission)
        ) {
            return next();
        }
        return res.status(403).send(`User does not have required permissions.`);
    };
};

const autoLoad = (dirPath: string): IHandler[] => {
    const requestSchema = getHandlers(HandlerType.REQUEST_SCHEMA, loader(dirPath, `request.`), `requestSchema`);
    const executors = getHandlers(HandlerType.EXECUTOR, loader(dirPath, `executor.`), `execute`);
    const responseSchema = getHandlers(HandlerType.RESPONSE_SCHEMA, loader(dirPath, `response.`), `responseSchema`);
    const final = getHandlers(HandlerType.FINAL);

    const handlers: IHandler[] = [];
    if (requestSchema) {
        handlers.push(requestSchema);
    }
    if (executors) {
        handlers.push(executors);
    }
    if (responseSchema) {
        handlers.push(responseSchema);
    }
    if (final) {
        handlers.push(final);
    }

    return handlers.sort((x, y) => x.weight - y.weight);
};

export const loadRoutes = (server: Express): void => {
    const routes: IRoute[] = load();
    routes.forEach((route) => {
        const authCallback = getAuthCallback(route.authLevel);
        const permissionsCallback = getPermissionsCallback(route.permission);
        server[route.httpMethod](
            route.path,
            permissionsCallback as Application,
            authCallback as Application,
            route.callbacks.map((c: IHandler) => c.cb as Application),
        );
    });
};
