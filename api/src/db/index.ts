import { Sequelize } from 'sequelize';
import config from '../config';

import { setAssociations } from './set-associations';
import { initModels } from './init-models';

const sequelize = new Sequelize(config.dbUri, {
    logging: config.dbLogging ? console.log : false,
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

    await sequelize.sync();

    console.log('All models were synchronized successfully.');
};

export { sequelize, dbConnect };
