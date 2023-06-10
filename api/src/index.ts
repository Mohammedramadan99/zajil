import 'reflect-metadata';
import app from './app';
import config from './config';
import { dbConnect } from './db';

const main = async () => {
    await dbConnect().catch((err) => {
        console.error(err);
        process.exit(1);
    });

    app.listen(config.port, config.host, () => {
        console.log(`App listening on ${config.host}:${config.port}`);
    });
};

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
