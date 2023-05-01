import express from 'express';
import { AuthController } from '../controllers/Auth';
import { UsersController } from '../controllers/Users';

const mainRouter = express.Router();
mainRouter.post('/register', UsersController.create);
mainRouter.post('/login', AuthController.login);
export default mainRouter;
