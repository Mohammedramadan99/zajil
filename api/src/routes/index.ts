import express from 'express';
import { AuthController } from '../modules/auth/controllers/Auth';
import { UsersController } from '../modules/users/controllers/Users';
import usersRouter from './users.router';
import businessesRouter from './businesses.router';
import branchesRouter from './branches.router';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { CreateUserDto } from '../modules/users/dto/create-user';

const mainRouter = express.Router();
mainRouter.post('/register', validateMiddleware(CreateUserDto), UsersController.create);
mainRouter.post('/login', AuthController.login);
mainRouter.get('/activate-account/:token', UsersController.activateAccount);
mainRouter.post('/request-account-activation', UsersController.requestAccountActivation);

mainRouter.use('/users', usersRouter);
mainRouter.use('/businesses', businessesRouter);
mainRouter.use('/branches', branchesRouter);

export default mainRouter;
