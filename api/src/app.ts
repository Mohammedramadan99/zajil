import Express from 'express';
import { applyMiddlewaresPost, applyMiddlewaresPre } from './middlewares';
import { handleErrors } from './middlewares/methods/handleErrors.middleware';
import cors from 'cors';
import mainRouter from './routes';

const app = Express();
app.use(Express.static('public'));
app.use(cors());
app.use(Express.json());
applyMiddlewaresPre(app);
app.use(mainRouter);
applyMiddlewaresPost(app);
app.use(handleErrors);

export default app;
