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
  // await sequelize.models.imumsg.bulkCreate([]);
  // await sequelize.models.gpsmsg.bulkCreate([]);

  // Create the rooms
  await sequelize.models.room.bulkCreate(roomList);

  // Create a new row of data for each room in each model's table
  roomList.forEach(async (room, idx) => {
    const simRow = { room: idx + 1 };
    await sequelize.models.simulationfailure.create(simRow);
    await sequelize.models.simulationstate.create(simRow);
    await sequelize.models.uia.create(simRow);
    await sequelize.models.gpsmsg.create(simRow);
    await sequelize.models.imumsg.create(simRow);
  });
  // await sequelize.models.role.bulkCreate([]);

  console.log('Done!');
}

reset();
