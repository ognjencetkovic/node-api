import { ErrorCode } from '../core/enums/ErrorCodes';
import { User } from '../dal/models/User';
import repositories from '../dal/repositories';
import { NotFoundError } from '../libs/error';

const getProfile = async (user_id: string): Promise<User> => {
    const user = await repositories.users.findById(user_id);
    if (!user) {
        throw new NotFoundError(`User not found.`, ErrorCode.USER_NOT_FOUND);
    }
    return user;
};

export default {
    getProfile,
};
