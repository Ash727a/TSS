import * as logging from './logging/index.js';
import role from './role.model.js';
import room from './room.model.js';
// import simulationControl from './simulationControl.model.js';
import simulationfailure from './simulationfailure.model.js';
import simulationstate from './simulationstate.model.js';
import simulationstateUIA from './simulationstateUIA.model.js';
import simulationuia from './simulationUIA.model.js';
import user from './user.model.js';

export default {
  role,
  room,
  // simulationControl,
  simulationfailure,
  simulationstate,
  // simulationstateUIA,
  // simulationuia,
  user,
  ...logging.default,
};
