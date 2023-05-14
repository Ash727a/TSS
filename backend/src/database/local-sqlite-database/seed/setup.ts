import { liveDatabaseName, teams } from '../../../config.js';
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
async function seed(models: { [key: string]: SequelizeModel }): Promise<void> {
  console.log('\nPopulating suits.sqlite database...');

  // Create the rooms
  await models.room.bulkCreate(teams);
  // Create a new row of data for each room in each model's table
  teams.forEach(async (teamData, idx) => {
    const roomIdx = idx + 1; // Adding 1 because we want to start at 1, not 0
    const simRow = { room: roomIdx };
    await models.simulationFailure.create(simRow);
    await models.simulationState.create(simRow);
    await models.uia.create(teamData);
    await models.rover.create(teamData);
    // Create a new row of data for each user
    const userRow = {
      team_name: teamData.name,
      room_id: roomIdx,
      ...teamData,
    };
    await models.user.create(userRow);
    // Create a new row of data for each gpsMsg for user guid
    const gpsRow = {
      user_guid: teamData.user_guid,
    };
    await models.gpsMsg.create(gpsRow);
    // await models.imuMsg.create(simRow);
  });

  console.log('Done!');
}

// We define all models according to their files.
const LiveDatabase = await Database.build<ILiveModels>(liveDatabaseName, liveModels);
applyExtraSetup(LiveDatabase);
seed(LiveDatabase.getModels());
