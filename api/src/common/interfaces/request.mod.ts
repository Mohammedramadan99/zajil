import { Request } from 'express';
import { IJWTPayload } from './jwt-payload';

export type RequestMod = Request & {
    user: IJWTPayload
};
