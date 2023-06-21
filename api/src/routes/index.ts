import express from 'express';
import { AuthController } from '../modules/auth/controllers/Auth';
import { UsersController } from '../modules/users/controllers/Users';
import usersRouter from './users.router';
import businessesRouter from './businesses.router';
import branchesRouter from './branches.router';
import { validateMiddleware } from '../middlewares/methods/validate.middleware';
import { CreateUserDto } from '../modules/users/dto/create-user';
import cardsRouter from './cards.router';
import { CardController } from '../modules/cards/controllers/Card';

const mainRouter = express.Router();
mainRouter.post('/register', validateMiddleware(CreateUserDto), UsersController.create);
mainRouter.post('/login', AuthController.login);
mainRouter.get('/activate-account/:token', UsersController.activateAccount);
mainRouter.post('/request-account-activation', UsersController.requestAccountActivation);

mainRouter.use('/users', usersRouter);
mainRouter.use('/businesses', businessesRouter);
mainRouter.use('/branches', branchesRouter);

// register apple pass device
mainRouter.post('/v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber', CardController.registerDevice);

// Unregister a Pass for Update Notifications
mainRouter.delete('/v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier/:serialNumber', CardController.unregisterDevice);

// Getting the Serial Numbers for Passes Associated with a Device
mainRouter.get('/v1/devices/:deviceLibraryIdentifier/registrations/:passTypeIdentifier', CardController.getSerialNumbers);

// Send an Updated Pass
mainRouter.get('/v1/passes/:passTypeIdentifier/:serialNumber', CardController.sendUpdatedPass);

// pass log
mainRouter.post('/v1/log', CardController.log);

export default mainRouter;
