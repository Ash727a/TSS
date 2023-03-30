import { liveDatabaseName, teams, visionKits } from '../../../config.js';
import { SequelizeModel } from '../../../interfaces.js';
import Database from '../../Database.class.js';
import { ILiveModels } from '../../models';
import { liveModels } from '../../models/index.js';
import applyExtraSetup from './extraSetup.js';

/**
 * Populates the database with the teams.
 * @param models The models to populate.
 * @returns {Promise<void>}
 */
async function seed(models: ILiveModels): Promise<void> {
  console.log('\nPopulating suits.sqlite database...');

  // Create the rooms
  await models.room.bulkCreate(teams);

  // Create the vision kits
  await models.visionKit.bulkCreate(visionKits);

  // Create a new row of data for each room in each model's table
  teams.forEach(async (room, idx) => {
    const simRow = { room: idx + 1 }; // Adding 1 because we want to start at 1, not 0
    await models.simulationControl.create(simRow);
    await models.simulationFailure.create(simRow);
    await models.simulationState.create(simRow);
    await models.uia.create(simRow);
    await models.gpsMsg.create(simRow);
    await models.imuMsg.create(simRow);
  });

  console.log('Done!');
}

// We define all models according to their files.
const LiveDatabase = await Database.build<ILiveModels>(liveDatabaseName, liveModels);
applyExtraSetup(LiveDatabase);
seed(LiveDatabase.getModels());
