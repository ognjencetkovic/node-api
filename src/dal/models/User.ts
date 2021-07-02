import { Permission } from './Permission';
import { Role } from './Role';

export class User {
    user_id!: string;
    email!: string;
    password?: string;
    roles!: Role[];
    permissions!: Permission[];
}
