import { Request, Response } from 'express';
import bl from '../../../bl';
import { IExecutorResponse } from '../../../core/interfaces/IExecutorResponse';

export async function execute(req: Request, res: Response): Promise<IExecutorResponse> {
    const data = await bl.users.getProfile(res.locals.user.user_id);
    return { status: 200, data };
}
