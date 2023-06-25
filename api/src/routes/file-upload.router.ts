import express from 'express';
import { FileUploadController } from '../modules/file-upload/controllers/file-upload.controller';

const fileUploadRouter = express.Router();
fileUploadRouter.post('/', FileUploadController.create);
fileUploadRouter.get('/', FileUploadController.list);
fileUploadRouter.get('/:id', FileUploadController.getFile);
fileUploadRouter.delete('/:id', FileUploadController.delete);
export default fileUploadRouter;
