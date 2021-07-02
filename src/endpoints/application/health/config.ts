import { AuthLevel } from '../../../core/enums/AuthLevel';
import { HttpMethod } from '../../../core/enums/HttpMethod';
import { IConfig } from '../../../core/interfaces/IConfig';

export const config: IConfig = {
    authLevel: AuthLevel.USER_LOGIN,
    httpMethod: HttpMethod.GET,
    path: `/application/health`,
};
