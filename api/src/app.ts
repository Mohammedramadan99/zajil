import Express from 'express';
import { applyMiddlewaresPost, applyMiddlewaresPre } from './middlewares';
import { handleErrors } from './middlewares/methods/handleErrors.middleware';
import mainRouter from './routes';

const app = Express();
app.use(Express.json());
applyMiddlewaresPre(app);
app.use(mainRouter);
applyMiddlewaresPost(app);
app.use(handleErrors);

export default app;
