import dotenv from 'dotenv';

import { liveDatabaseName, logDatabaseName } from './config.js';
import Database from './database/Database.class.js';
// import sequelize from './database/index.js';
import { ILiveModels, ILogModels } from './database/models';
import { liveModels, logModels } from './database/models/index.js';
import ExpressApp from './server/express/app.js';
import { TSSWebSocketServer } from './server/sockets/TSSWebSocketServer.js';

// Environment variables
dotenv.config();
const API_URL: string | undefined = process.env.API_URL as string | undefined;
const API_PORT: number | undefined = process.env.API_PORT as number | undefined;
const SOCKET_PORT: number | undefined = process.env.SOCKET_PORT as number | undefined;

// We define all models according to their files.
const LiveDatabase: Database<ILiveModels> = await Database.build(liveDatabaseName, liveModels);
const LogDatabase: Database<ILogModels> = await Database.build(logDatabaseName, logModels);
const express: ExpressApp = new ExpressApp({ ...LiveDatabase.getModels(), ...LogDatabase.getModels() });

// Log the environment variables
console.log(`API PORT: ${API_PORT}`);
console.log(`SOCKET PORT: ${SOCKET_PORT}`);

async function assertDatabaseConnectionOk(): Promise<void> {
  console.log('Checking database connection...');
  try {
    await LiveDatabase.authenticate();
    await LogDatabase.authenticate();
    console.log('Database connection OK!');
  } catch (error: any) {
    console.log('Unable to connect to the database:');
    console.log(error.message);
    process.exit(1);
  }
}

async function init(): Promise<void> {
  await assertDatabaseConnectionOk();

  // Sets cmd field of rover to empty on (re)start
  const rover_bois = await LiveDatabase.getModels().rover.update({ cmd: '' }, { where: {} });

  console.log(`Starting Sequelize + Express example on port ${API_PORT}...`);

  const socket_server = new TSSWebSocketServer(
    { ...LiveDatabase.getModels(), ...LogDatabase.getModels() },
    SOCKET_PORT ?? 3001
  );

  express.app.listen(API_PORT, () => {
    console.log(`Express server started on port ${API_PORT}. Try some routes, such as '/api/users'.`);
  });
}

init();
