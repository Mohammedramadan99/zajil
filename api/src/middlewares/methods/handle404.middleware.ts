import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../common';

const handle404 = (req: Request, res: Response, next: NextFunction) => {
    const err = new HttpError(404, 'Not Found');
    next(err);
};

export default {
    middleware: handle404,
    condition: true, // all routes
};
