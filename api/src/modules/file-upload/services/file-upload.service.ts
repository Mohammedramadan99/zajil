import { UploadedFile } from 'express-fileupload';
import { HttpError } from '../../../common';
import { User } from '../../users/models/user.model';
import path from 'path';
import fs from 'fs';
import { File } from '../models/file.model';

export const uploadFile = async (file: UploadedFile, user: User) => {
    await validateUploadFile(file);

    const uploadFolderParent = path.join(__dirname, '../../../../public/uploads');
    let fileName: string;
    let uploadFolder: string;

    try {
        // generate a random file name
        fileName = `${new Date().getTime()}-${user.id}-${file.name}`;

        // create a user uploads folder if not exist
        uploadFolder = path.join(uploadFolderParent, `${user.id}`);
        if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

        // move the file to the uploads folder
        await file.mv(path.join(uploadFolder, fileName));

        // save the file to the database
        const fileCreated = await File.create({
            createdBy: user.id,
            name: file.name,
            url: `${process.env.PROTOCOL || 'https'}://${process.env.HOST}:${process.env.PORT}/uploads/${
                user.id
            }/${fileName}`,
            mimeType: file.mimetype,
        });

        return fileCreated;
    } catch (error) {
        // remove the file if any error occurs
        if (fileName && uploadFolder) fs.unlinkSync(path.join(uploadFolder, fileName));

        throw error;
    }
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
    const path = file.url.split('uploads')[1];
    const filePath = `${__dirname}/../../../../public/uploads${path}`;
    // remove file if exist
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

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
