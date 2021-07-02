import config from '../core/config';
import { ErrorCode } from '../core/enums/ErrorCodes';
import { Roles } from '../core/enums/Roles';
import { Permission } from '../dal/models/Permission';
import { Role } from '../dal/models/Role';
import repositories from '../dal/repositories';
import { saltHashPassword, validatePassword } from '../libs/crypto';
import { getTimestampInDays } from '../libs/date';
import { GenericError, NotFoundError, UserCredentialsError } from '../libs/error';
import jwt from '../libs/jwt';
interface AuthResponse {
    access_token: string;
    refresh_token: string;
}

const createUserToken = (user_id: string, roles: Role[], permissions: Permission[]) =>
    jwt.sign({ user_id, roles, permissions }, config.JWT.secret, config.JWT.expiresIn);

const createRefreshToken = async (user_id: string, session_id?: string) => {
    const expires_at = getTimestampInDays(7);
    return repositories.refreshTokens.create(user_id, expires_at, session_id || null);
};

const register = async (email: string, password: string, session_id: string): Promise<AuthResponse> => {
    const userExists = await repositories.users.findByEmail(email);
    if (userExists) {
        throw new GenericError(`User already exists.`, ErrorCode.USER_ALREADY_EXIST);
    }
    const role = await repositories.roles.findByName(Roles.USER);
    if (!role) {
        throw new NotFoundError(`Role user not found.`, ErrorCode.ROLE_NOT_FOUND);
    }
    const hash = saltHashPassword(password);
    const user = await repositories.users.register(email, hash, role.role_id);

    const access_token = createUserToken(user.user_id, user.roles, user.permissions);
    const refresh_token = await createRefreshToken(user.user_id, session_id);
    return { access_token, refresh_token: refresh_token.token };
};

const login = async (email: string, password: string, session_id: string): Promise<AuthResponse> => {
    const user = await repositories.users.findByEmail(email, true);

    if (!user) {
        throw new UserCredentialsError(ErrorCode.USER_CREDENTIALS_INVALID);
    }
    const isPassValid = validatePassword(password, user.password || ``);
    if (!isPassValid) {
        throw new UserCredentialsError(ErrorCode.USER_CREDENTIALS_INVALID);
    }
    const access_token = createUserToken(user.user_id, user.roles, user.permissions);
    const refresh_token = await createRefreshToken(user.user_id, session_id);
    return { access_token, refresh_token: refresh_token.token };
};

const refreshToken = async (refresh_token: string): Promise<AuthResponse> => {
    const refreshToken = await repositories.refreshTokens.getById(refresh_token);
    const user = await repositories.users.findById(refreshToken.user_id);
    if (!user) {
        throw new NotFoundError(`User not found.`, ErrorCode.USER_NOT_FOUND);
    }
    const access_token = createUserToken(user.user_id, user.roles, user.permissions);
    return { access_token, refresh_token };
};

export default {
    register,
    login,
    refreshToken,
};
