import { Sequelize } from 'sequelize';
import { init as initUser } from './models/user.model';
import config from '../config';

const sequelize = new Sequelize(config.dbUri, {
    logging: config.dbLogging ? console.log : false,
});

// loop over the models in the models and initialize each one
const modelInits = [initUser];
for (const init of modelInits) init(sequelize);

// connect to the database
const dbConnect = async () => {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    console.log("Models", sequelize.models);

    await sequelize.sync({ alter: true }); // TODO: remove "alter: true" after the schema is stable
    console.log('All models were synchronized successfully.');
};

export { sequelize, dbConnect };
