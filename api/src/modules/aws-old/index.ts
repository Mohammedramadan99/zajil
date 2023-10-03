import * as AWS from 'aws-sdk';
import config from '../../config';

AWS.config.update({
    secretAccessKey: config.aws.secretAccessKey,
    accessKeyId: config.aws.accessKeyId,
    region: config.aws.region,
    signatureVersion: 'v4', //API version
});

// S3
export const s3 = new AWS.S3({ signatureVersion: 'v4' });
