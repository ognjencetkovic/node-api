import Ajv, { AnySchema, ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { Request, Response } from 'express';

interface IValidationResponse {
    valid: boolean | Promise<unknown>;
    errors: ErrorObject<string, Record<string, unknown>, unknown>[] | null | undefined;
    message: string;
}

const validator = new Ajv({ coerceTypes: true, useDefaults: true });
addFormats(validator);

export function validateSchema(req: Request, res: Response, next: Function, object: object, schema: AnySchema): void {
    let result: IValidationResponse;
    try {
        result = {
            valid: validator.validate(schema, object),
            errors: validator.errors,
            message: validator.errorsText(),
        };
    } catch (error) {
        result = {
            valid: false,
            errors: [error],
            message: `Unexpected validation error`,
        };
    }

    if (!result.valid) {
        res.locals.hasError = true;
        res.locals.errors = result.errors;
    }
    next();
}
