import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { cloudinaryConfig } from '.';

// configure cloudinary
cloudinaryConfig;

// upload a file to cloudinary
export const uploadFile = async (
    file: {
        name: string;
        data: Buffer;
        contentType?: string;
        ContentDisposition?: string;
    },
    folder: string,
): Promise<any> => {
    // save the file to the temp folder
    fs.writeFileSync(path.join(__dirname, `../../tempFiles/${file.name}`), file.data);
    const tempFilePath = path.join(__dirname, `../../tempFiles/${file.name}`);

    // upload the file to cloudinary if the file is an image or an zip file
    const res = await cloudinary.v2.uploader.upload(tempFilePath, {
        folder,
        resource_type: 'auto',
        public_id: file.name,
    });

    // delete the temp file
    fs.unlinkSync(tempFilePath);

    return {
        Location: res.secure_url,
        Key: res.public_id,
    };
};

// delete a file in cloudinary
export const deleteFile = async (key: string): Promise<void> => {
    await cloudinary.v2.uploader.destroy(key);
};

// get a file buffer from cloudinary
export const getFile = async (url) => {
    // Fetch the file using the generated URL
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} - ${response.statusText}`);
    }

    // Convert the response body into a Buffer
    const fileBuffer = await response.buffer();

    return { Body: fileBuffer };
};

// delete a folder in cloudinary
export const deleteFolder = async (dir) => {
    const res = await cloudinary.v2.api.delete_resources_by_prefix(dir);

    return res;
};
