import dotenv from 'dotenv';

import Database from './database/Database.class.js';
import sequelize from './database/index.js';
import { liveModels } from './database/models/index.js';
import ExpressApp from './server/express/app.js';

// Environment variables
dotenv.config();
const API_URL = process.env.API_URL as string | undefined;
const API_PORT = process.env.API_PORT as number | undefined;
const SOCKET_PORT = process.env.SOCKET_PORT as number | undefined;

// We define all models according to their files.
const modelsArray: [] = Object.values(liveModels as any) as [];
const LiveDatabase = await Database.build('suits', modelsArray);
const express = new ExpressApp(LiveDatabase.getModels());
// let models = LiveDatabase.getModels();
// export function getModels() {
//   return models;
// }

// Log the environment variables
console.log(`API PORT: ${API_PORT}`);
console.log(`SOCKET PORT: ${SOCKET_PORT}`);

async function assertDatabaseConnectionOk(): Promise<void> {
  console.log('Checking database connection...');
  try {
    await sequelize.authenticate();
    console.log('Database connection OK!');
  } catch (error: any) {
    console.log('Unable to connect to the database:');
    console.log(error.message);
    process.exit(1);
  }
}

async function init(): Promise<void> {
  await assertDatabaseConnectionOk();

  console.log(`Starting Sequelize + Express example on port ${API_PORT}...`);

  express.app.listen(API_PORT, () => {
    console.log(`Express server started on port ${API_PORT}. Try some routes, such as '/api/users'.`);
  });
}

init();
