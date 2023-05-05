import { NextFunction, Request, Response } from 'express';

const LoggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
};

export default {
    middleware: LoggingMiddleware,
    condition: true, // all routes
};