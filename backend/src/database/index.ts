import Database from './Database.class.js';
import setup from './extraSetup.js';
import { liveModels } from './models/index.js';

// We define all models according to their files.
const modelsArray: [] = Object.values(liveModels) as [];

const LiveDatabase: Database = await Database.build('suits', modelsArray);

// We execute any extra setup after the models are defined, such as adding associations.
setup.applyExtraSetup(LiveDatabase);

// We export the sequelize connection instance to be used around our app.
export default LiveDatabase;
