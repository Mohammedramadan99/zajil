import { NextFunction, Request, Response } from 'express';

export const handleErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
    try {
        err.message = JSON.parse(err.message);
    } catch (error) {}

    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || 'Internal Server Error',
    });
};