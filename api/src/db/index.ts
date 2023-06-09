import { Sequelize } from 'sequelize';
import config from '../config';

import { setAssociations } from './set-associations';
import { initModels } from './init-models';

const sequelize = new Sequelize(config.db.uri, {
    logging: config.db.logging ? console.log : false,
});

// initialize models
initModels(sequelize);

// setup model associations
setAssociations();

// connect to the database
const dbConnect = async () => {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    console.log('Models', sequelize.models);

    // default false
    if (config.db.sync)
        await sequelize.sync({
            alter: config.db.syncAlter, // default false
            force: config.db.syncForce, // default false
        });

    console.log('All models were synchronized successfully.');
};

export { sequelize, dbConnect };
