require('dotenv').config();
// const express = require("express");
// const cors = require('cors');
const sequelize = require('./app/database');
const app = require('./app/server/express/app');
// const app = express();

// Environment variables
const API_URL = process.env.API_URL;
const API_PORT = process.env.API_PORT;
const SOCKET_PORT = process.env.SOCKET_PORT;

// const corsOptions = {
//   origin: `http://${API_URL}:${API_PORT}`,
// };

// Log the environment variables
console.log(`API PORT: ${API_PORT}`);
console.log(`SOCKET PORT: ${SOCKET_PORT}`);

// app.use(cors(corsOptions));

// Parse requests of content-type - application/json
// app.use(express.json());

// Parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log('Database connection OK!');
  } catch (error) {
    console.log('Unable to connect to the database:');
    console.log(error.message);
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();

  console.log(`Starting Sequelize + Express example on port ${API_PORT}...`);

  app.listen(API_PORT, () => {
    console.log(`Express server started on port ${API_PORT}. Try some routes, such as '/api/users'.`);
  });
}

init();
