import path from 'path';
import { Sequelize } from 'sequelize';

import setup from './extra-setup.js';
import * as models from './models/index.js';

const appDir = path.resolve(process.cwd());
console.log('cwd', appDir);
const dbPath = path.join(appDir, 'src', 'database', 'local-sqlite-database', 'suits.sqlite');

console.log(`DB Path: ${dbPath}`);
// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logQueryParameters: false,
  logging: false,
  benchmark: true,
});

const modelsModulesObject = models.default as { [key: string]: (sequelize: any) => void };

// We define all models according to their files.
for (const model in modelsModulesObject) {
  const modelDefiner = modelsModulesObject[model];
  modelDefiner(sequelize);
}

// We execute any extra setup after the models are defined, such as adding associations.
setup.applyExtraSetup(sequelize);
console.log('done');
// We export the sequelize connection instance to be used around our app.
// module.exports = sequelize;
export default sequelize;
