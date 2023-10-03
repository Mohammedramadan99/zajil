import cloudinary from 'cloudinary';
import config from '../../config';

export const cloudinaryConfig = cloudinary.v2.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});
