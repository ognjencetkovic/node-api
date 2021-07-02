import { Request } from 'express';
import bl from '../../../bl';
import { IExecutorResponse } from '../../../core/interfaces/IExecutorResponse';

export async function execute(req: Request): Promise<IExecutorResponse> {
    const { refresh_token } = req.body;
    const data = await bl.auth.refreshToken(refresh_token);
    return { status: 200, data };
}
