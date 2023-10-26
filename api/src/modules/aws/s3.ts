import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { cloudinaryConfig } from '.';

cloudinaryConfig;

export const uploadFile = async (
    file: {
        name: string;
        data: Buffer;
        contentType?: string;
        ContentDisposition?: string;
    },
    folder: string,
): Promise<any> => {
    fs.writeFileSync(path.join(__dirname, `../../tempFiles/${file.name}`), file.data);

    const tempFilePath = path.join(__dirname, `../../tempFiles/${file.name}`);
    const fileUrl = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/raw/upload/${folder}/${file.name}`;

    const fileExists = await fetch(fileUrl);
    if (fileExists.status === 200) {
        await cloudinary.v2.uploader.destroy(file.name);
    }

    const res = await cloudinary.v2.uploader.upload(tempFilePath, {
        folder,
        resource_type: 'auto',
        public_id: file.name,
    });

    fs.unlinkSync(tempFilePath);

    return {
        Location: res.secure_url,
        Key: res.public_id,
    };
};

export const deleteFile = async (key: string): Promise<void> => {
    await cloudinary.v2.uploader.destroy(key);
};

export const getFile = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} - ${response.statusText}`);
    }

    const fileBuffer = await response.buffer();

    return { Body: fileBuffer };
};

export const deleteFolder = async (dir) => {
    const res = await cloudinary.v2.api.delete_resources_by_prefix(dir);

    return res;
};
