import { NextFunction, Request, Response } from 'express';
import * as branchServices from '../services';
import { HttpError } from '../../../common';
import { RequestMod } from '../../../common/interfaces/request.mod';
import ICRUDController from '../../../common/interfaces/crud.controller';
import { CreateBranchDto } from '../dto/create-branch';
import { UpdateBranchDto } from '../dto/update-branch';

export const BranchController: ICRUDController = {
    create: function (req: RequestMod, res: Response, next: NextFunction): void {
        const body: CreateBranchDto = req.body;
        branchServices
            .createBranch(body, req)
            .then((branch) => res.status(201).json(branch))
            .catch((err) => {
                console.error(err);
                next(new HttpError(500, err.message));
            });
    },

    getOne: function (req: RequestMod, res: Response, next: NextFunction): void {
        const branchId = Number(req.params.id);

        branchServices
            .findOneBranchById(branchId)
            .then((branch) => res.json(branch))
            .catch((err) => {
                console.error(err);
                next(new HttpError(404, err.message));
            });
    },
    getAll: function (req: RequestMod, res: Response, next: NextFunction): void {
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;

        branchServices
            .findAllBranches({ limit, offset, req })
            .then((branch) => res.json(branch))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    update: function (req: Request, res: Response, next: NextFunction): void {
        const branchId = Number(req.params.id);
        const body: UpdateBranchDto = req.body;

        branchServices
            .updateBranchById(branchId, body)
            .then((branch) => res.json(branch))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
    delete: function (req: Request, res: Response, next: NextFunction): void {
        const branchId = Number(req.params.id);

        branchServices
            .deleteBranchById(branchId)
            .then((branch) => res.json(branch))
            .catch((err) => {
                console.error(err);
                if (err instanceof HttpError) next(err);
                else next(new HttpError(500, err.message));
            });
    },
};
