import { NextFunction, Response } from 'express';
import ICRUDController from '../../../common/interfaces/crud.controller';
import { RequestMod } from '../../../common/interfaces/request.mod';
import * as fileUploadService from '../services/file-upload.service';
import { UploadedFile } from 'express-fileupload';

export const FileUploadController = {
    create: function (req: RequestMod, res: Response, next: NextFunction): void {
        const file = req.files.file as UploadedFile;
        if (!file) {
            return next(new Error('No file uploaded'));
        }

        fileUploadService
            .uploadFile(file, req.user)
            .then((file) => {
                res.json(file);
            })
            .catch((err) => {
                next(err);
            });
    },

    list: function (req: RequestMod, res: Response, next: NextFunction): void {
        fileUploadService
            .listFiles(req.user)
            .then((files) => {
                res.json(files);
            })
            .catch((err) => {
                next(err);
            });
    },

    getFile: function (req: RequestMod, res: Response, next: NextFunction): void {
        fileUploadService
            .getFile(Number(req.params.id), req.user)
            .then((file) => {
                res.json(file);
            })
            .catch((err) => {
                next(err);
            });
    },

    delete: function (req: RequestMod, res: Response, next: NextFunction): void {
        fileUploadService
            .deleteFile(Number(req.params.id), req.user)
            .then((file) => {
                res.json(file);
            })
            .catch((err) => {
                next(err);
            });
    },
};
