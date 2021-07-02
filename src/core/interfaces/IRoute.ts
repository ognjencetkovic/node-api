import { IConfig } from './IConfig';
import { IHandler } from './IHandler';

export interface IRoute extends IConfig {
    callbacks: IHandler[];
}
