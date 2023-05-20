import express from 'express';
import { UsersController } from '../modules/users/controllers/Users';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { CreateUserDto } from '../dto/users/create-user';
import { UpdateUserDto } from '../dto/users/update-user';

const usersRouter = express.Router();

// CRUD routes
usersRouter.post('/', validateMiddleware(CreateUserDto), UsersController.create);
usersRouter.get('/', UsersController.getAll);
usersRouter.get('/' + ':id', UsersController.getOne);
usersRouter.patch('/' + ':id', validateMiddleware(UpdateUserDto), UsersController.update);
usersRouter.delete('/' + ':id', UsersController.delete);

export default usersRouter;
