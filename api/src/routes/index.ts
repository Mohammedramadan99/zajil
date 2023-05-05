import express from 'express';
import { AuthController } from '../controllers/Auth';
import { UsersController } from '../controllers/Users';
import usersRouter from './users.router';
import businessesRouter from './businesses.router';

const mainRouter = express.Router();
mainRouter.post('/register', UsersController.create);
mainRouter.post('/login', AuthController.login);

mainRouter.use('/users', usersRouter);
mainRouter.use('/businesses', businessesRouter);

export default mainRouter;
