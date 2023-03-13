import path from 'path';

import Database from './Database.class.js';
// import { Sequelize } from 'sequelize-typescript';
import setup from './extraSetup.js';
import * as models from './models/index.js';

// console.log('cwd', appDir);
// const dbPath = path.join(appDir, 'src', 'database', 'local-sqlite-database', 'suits.sqlite');

// console.log(`DB Path: ${dbPath}`);
// In a real app, you should keep the database connection URL as an environment variable.
// But for this example, we will just use a local SQLite database.
// const sequelize = new Sequelize(process.env.DB_CONNECTION_URL);

// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: dbPath,
//   logQueryParameters: false,
//   logging: false, // Set to console.log for developer mode (shows the SQL statements executed in terminal), false to be less verbose
//   benchmark: true,
// });

// We define all models according to their files.
const modelsArray: [] = Object.values(models.default as any) as [];

const LiveDatabase = new Database('suits', {}, modelsArray);

// sequelize.addModels(modelsArray);
// await sequelize.sync(); // Update database schema to match models

// We execute any extra setup after the models are defined, such as adding associations.
setup.applyExtraSetup(LiveDatabase.sequelize);

// We export the sequelize connection instance to be used around our app.
export default LiveDatabase.sequelize;
