import express from 'express';
import { AuthController } from '../controllers/Auth';
import { UsersController } from '../controllers/Users';
import usersRouter from './users.router';

const mainRouter = express.Router();
mainRouter.post('/register', UsersController.create);
mainRouter.post('/login', AuthController.login);

mainRouter.use('/users', usersRouter);

export default mainRouter;
