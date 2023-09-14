import Express from 'express';
import { applyMiddlewaresPost, applyMiddlewaresPre } from './middlewares';
import { handleErrors } from './middlewares/methods/handleErrors.middleware';
import cors from 'cors';
import mainRouter from './routes';
import fileUpload from 'express-fileupload';
import config from './config';
import { cronJob } from './utils/cronJob';

const app = Express();
app.use(config.apiPrefix, Express.static('public'));
app.use(cors());
app.use(Express.json());
app.use(
    fileUpload({
        // 5MB
        limits: { fileSize: 5 * 1024 * 1024 },
    }),
);
applyMiddlewaresPre(app);
app.use(config.apiPrefix, mainRouter);
applyMiddlewaresPost(app);
app.use(handleErrors);
cronJob();

export default app;
