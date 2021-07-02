import { Request } from 'express';
import bl from '../../../bl';
import { IExecutorResponse } from '../../../core/interfaces/IExecutorResponse';

interface IRegisterRequest {
    email: string;
    password: string;
}

export async function execute(req: Request): Promise<IExecutorResponse> {
    const { email, password }: IRegisterRequest = req.body;
    const { session_id } = req.headers;
    const data = await bl.auth.register(email, password, session_id as string);
    return { status: 200, data };
}
