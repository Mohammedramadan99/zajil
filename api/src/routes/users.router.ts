import express from 'express';
import { UsersController } from '../controllers/Users';
import { setCRUDRoutes } from '../helpers';

const usersRouter = express.Router();
setCRUDRoutes(usersRouter, UsersController)
export default usersRouter;
