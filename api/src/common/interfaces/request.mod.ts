import { Request } from 'express';
import { User } from '../../modules/users/models/user.model';

export type RequestMod = Request & {
    user: User
};
