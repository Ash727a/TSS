import sequelize from '../../index.js';

// import { pickRandom, randomDate } from './helpers.js';

async function reset(): Promise<void> {
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
  await sequelize.models.user.bulkCreate([]);
  // await sequelize.models.lsar.bulkCreate([]);
  // await sequelize.models.imuMsg.bulkCreate([]);
  // await sequelize.models.gpsMsg.bulkCreate([]);

  // Create the rooms
  await sequelize.models.room.bulkCreate(roomList);

  // Create a new row of data for each room in each model's table
  roomList.forEach(async (room, idx) => {
    const simRow = { room: idx + 1 };
    await sequelize.models.simulationFailure.create(simRow);
    await sequelize.models.simulationState.create(simRow);
    await sequelize.models.uia.create(simRow);
    await sequelize.models.gpsMsg.create(simRow);
    await sequelize.models.imuMsg.create(simRow);
  });
  // await sequelize.models.role.bulkCreate([]);

  console.log('Done!');
}

reset();
