import { AuthLevel } from '../enums/AuthLevel';
import { HttpMethod } from '../enums/HttpMethod';

export interface IConfig {
    authLevel: AuthLevel;
    permission?: string;
    httpMethod: HttpMethod;
    path: string;
    weight?: number;
}
