import { Express } from 'express';
import conditional from 'express-conditional-middleware';

import loggingMiddleware from './methods/logging.middleware';
import responseFormatterMiddleware from './methods/response-formatter.middleware';
import authMiddleware from './methods/auth.middleware';
import handle404Middleware from './methods/handle404.middleware';
import accountActivationMiddleware from './methods/account-activation.middleware';

const midsPre = [loggingMiddleware, responseFormatterMiddleware, authMiddleware, accountActivationMiddleware];
const midsPost = [handle404Middleware];

// applys middlewares before the main router
export const applyMiddlewaresPre = (app: Express) =>
    midsPre.forEach((mid) => app.use(conditional(mid.condition, mid.middleware)));

// applys middlewares after the main router
export const applyMiddlewaresPost = (app: Express) =>
    midsPost.forEach((mid) => app.use(conditional(mid.condition, mid.middleware)));
