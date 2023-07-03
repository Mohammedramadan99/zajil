import { GetObjectOutput, ManagedUpload } from 'aws-sdk/clients/s3';
import { s3 } from '.';
import config from '../../config';

export const BUCKET_NAME = config.aws.s3.bucketName;

export const uploadFile = async (
    file: {
        name: string;
        data: Buffer;
    },
    folder: string,
): Promise<ManagedUpload.SendData> => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${folder}/${file.name}`,
        Body: file.data,
    };
    return await s3.upload(params).promise();
};

export const deleteFile = async (key: string): Promise<void> => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
    };
    await s3.deleteObject(params).promise();
};

export const getFile = async (key: string) => {
    const params = {
        Bucket: BUCKET_NAME,
        Key: key,
    };
    return await s3.getObject(params).promise();
};

export const deleteFolder = async (dir) => {
    const listParams = {
        Bucket: BUCKET_NAME,
        Prefix: dir,
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: BUCKET_NAME,
        Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await deleteFile(dir);
};
