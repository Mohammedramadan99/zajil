import * as path from 'path';
import glob from 'glob';
import { Sequelize } from 'sequelize';

export const initModels = (sequelize: Sequelize) => {
    // find all .model.ts files in the src.modules folders and sub folders
    const files = glob.sync('**/*.model.{ts,js}', {
        cwd: path.join(__dirname, '../modules'),
    });

    // import each model and call its init() function
    files.forEach((file) => {
        const model = require(path.join(__dirname, '../modules', file));
        model.init(sequelize);
    });
};
