import { execQuerySingle } from '..';
import { RefreshToken } from '../models/RefreshToken';
import sql from '../sql';

const create = async (user_id: string, expires_at: string, session_id: string | null): Promise<RefreshToken> => {
    const refresh_token = await execQuerySingle(sql.refresh_tokens.create, { user_id, expires_at, session_id });
    return refresh_token as RefreshToken;
};

const getById = async (id: string): Promise<RefreshToken> => {
    const refresh_token = await execQuerySingle(sql.refresh_tokens.findById, { id });
    return refresh_token as RefreshToken;
};

export default {
    create,
    getById,
};
