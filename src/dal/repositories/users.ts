import { execQuerySingle } from '..';
import { User } from '../models/User';
import sql from '../sql';

const findById = async (id: string, includePassword = false): Promise<User | null> => {
    let user: User | null = null;
    const result = await execQuerySingle(sql.users.findById, { id });
    if (result) {
        user = result as User;
    }
    if (user && !includePassword) {
        delete user.password;
    }
    return user;
};

const findByEmail = async (email: string, includePassword = false): Promise<User | null> => {
    let user: User | null = null;
    const result = await execQuerySingle(sql.users.findByEmail, { email });
    if (result) {
        user = result as User;
    }
    if (user && !includePassword) {
        delete user.password;
    }
    return user;
};

const register = async (email: string, password: string, role: string): Promise<User> => {
    const user = await execQuerySingle(sql.users.register, { email, password, role });
    return user as User;
};

export default {
    findById,
    findByEmail,
    register,
};
