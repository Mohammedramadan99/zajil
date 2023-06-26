import glob from 'glob';
import * as path from 'path';

export const setAssociations = () => {
    // find all .model.ts files in the src.modules folders and sub folders
    const files = glob.sync('**/*.model.{ts,js}', {
        cwd: path.join(__dirname, '../modules'),
    });

    // import each model and call its associate() function
    files.forEach((file) => {
        const model = require(path.join(__dirname, '../modules', file));
        model.associate();
    });
};
