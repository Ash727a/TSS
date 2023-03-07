import * as logging from './logging/index.js';
import room from './room.model.js';
import simulationcontrol from './simulationcontrol.model.js';
import simulationfailure from './simulationfailure.model.js';
import simulationstate from './simulationstate.model.js';
import simulationstateUIA from './simulationstateUIA.model.js';
import simulationuia from './simulationUIA.model.js';
import user from './user.model.js';

export default {
  room,
  simulationcontrol,
  simulationfailure,
  simulationstate,
  simulationstateUIA,
  simulationuia,
  user,
  ...logging.default,
};
