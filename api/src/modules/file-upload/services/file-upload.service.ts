import { UploadedFile } from 'express-fileupload';
import { HttpError } from '../../../common';
import { User } from '../../users/models/user.model';
import path from 'path';
import fs from 'fs';
import { File } from '../models/file.model';
import * as s3 from '../../aws/s3';

export const uploadFile = async (file: UploadedFile, user: User) => {
    await validateUploadFile(file);

    const uploadFolderParent = 'uploads';
    let uploadFolder: string = `${uploadFolderParent}/${user.id}`;

    // generate a random file name
    const fileName = `${new Date().getTime()}-${user.id}-${file.name}`;

    // create the upload folder if not exist
    const res = await s3.uploadFile(
        {
            name: fileName,
            data: file.data,
        },
        uploadFolder,
    );

    // save the file to the database
    const fileCreated = await File.create({
        createdBy: user.id,
        name: file.name,
        url: res.Location,
        mimeType: file.mimetype,
        key: res.Key,
    });

    return fileCreated;
};

export const listFiles = async (user: User) => {
    const files = await File.findAll({
        where: {
            createdBy: user.id,
        },
    });

    return files;
};

export const getFile = async (id: number, user: User) => {
    const file = await File.findOne({
        where: {
            id,
            createdBy: user.id,
        },
    });

    if (!file) throw new HttpError(404, 'File not found');

    return file;
};

export const deleteFile = async (id: number, user: User) => {
    const file = await File.findOne({
        where: {
            id,
            createdBy: user.id,
        },
    });

    if (!file) throw new HttpError(404, 'File not found');

    // remove the file from the uploads folder
    await s3.deleteFile(file.key);

    // remove the file from the database
    await file.destroy();

    return file;
};

const validateUploadFile = async (file: UploadedFile) => {
    // only accept image file [png, jpg, jpeg] from the mime type
    const allowedMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new HttpError(400, 'Invalid file type, only [png, jpg, jpeg] are allowed');
    }

    // only accept file size <= 5MB
    const allowedFileSize = 5 * 1024 * 1024;
    if (file.size > allowedFileSize) {
        throw new HttpError(400, 'File size is too large, only <= 5MB are allowed');
    }

    return file;
};
