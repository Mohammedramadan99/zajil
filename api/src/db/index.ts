import { Sequelize } from 'sequelize';
import config from '../config';

import { init as initUser } from './models/user.model';
import { init as initBusiness } from './models/business.model';
import { init as initBranch } from './models/branch.model';
import { init as initCard } from './models/card.model';
import { init as initLoyaltyCard } from './models/card-types/loyalty.model';
import { init as initItemsSubscriptionCard } from './models/card-types/items-subscription.model';
import { setAssociations } from './set-associations';

const sequelize = new Sequelize(config.dbUri, {
    logging: config.dbLogging ? console.log : false,
});

// loop over the models in the models and initialize each one
const modelInits = [initUser, initBusiness, initBranch, initCard, initLoyaltyCard, initItemsSubscriptionCard];
for (const init of modelInits) init(sequelize);

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
