import { Request } from 'express';
import { User } from '../../db/models/user.model';

export type RequestMod = Request & {
    user: User
};
