import { Model, ModelCtor } from 'sequelize-typescript';

import Database from '../../Database.class.js';
import { liveModels } from '../../models/index.js';

// import { pickRandom, randomDate } from './helpers.js';

async function reset(models: { [key: string]: ModelCtor<Model> }): Promise<void> {
  console.log('\nPopulating suits.sqlite database...');

  const roomList = [
    { name: 'alpha' },
    { name: 'beta' },
    { name: 'gamma' },
    { name: 'delta' },
    { name: 'eplsilon' },
    { name: 'zeta' },
    { name: 'eta' },
    { name: 'theta' },
    { name: 'iota' },
    { name: 'kappa' },
    { name: 'lambda' },
    { name: 'mu' },
    // { name: 'nu' },
    // { name: 'xi' },
    // { name: 'omicron' },
    // { name: 'pi' },
    // { name: 'rho' },
    // { name: 'sigma' },
    // { name: 'tau' },
    // { name: 'upsilon' },
    // { name: 'phi' },
    // { name: 'chi' },
    // { name: 'psi' },
    // { name: 'omega' },
  ];
  // await models.user.bulkCreate([]);
  // await sequelize.models.lsar.bulkCreate([]);
  // await sequelize.models.imuMsg.bulkCreate([]);
  // await sequelize.models.gpsMsg.bulkCreate([]);

  // Create the rooms
  await models.room.bulkCreate(roomList);

  // Create a new row of data for each room in each model's table
  roomList.forEach(async (room, idx) => {
    const simRow = { room: idx + 1 };
    await models.simulationFailure.create(simRow);
    await models.simulationState.create(simRow);
    await models.uia.create(simRow);
    await models.gpsMsg.create(simRow);
    await models.imuMsg.create(simRow);
  });
  // await sequelize.models.role.bulkCreate([]);

  console.log('Done!');
}

// We define all models according to their files.
const modelsArray: [] = Object.values(liveModels as any) as [];

const LiveDatabase = await Database.build('suits', modelsArray);
reset(LiveDatabase.getModels());
