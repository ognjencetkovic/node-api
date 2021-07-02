import { execQuerySingle } from '..';
import { Role } from '../models/Role';
import sql from '../sql';

const findByName = async (name: string): Promise<Role | null> => {
    const role = await execQuerySingle(sql.roles.findByName, { name });
    return (role as Role) || null;
};

export default {
    findByName,
};
