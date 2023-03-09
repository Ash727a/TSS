import * as logging from './logging/index.js';
import role from './role.model.js';
import room from './room.model.js';
import * as stations from './stations/index.js';
import * as teams from './teams/index.js';
import * as telemetry from './telemetry/index.js';

/** EXPORT MODULE: models
 * @fileoverview Exports all models in the models directory.
 * @module models
 * @category models
 */

export default {
  ...logging.default,
  role,
  room,
  ...stations.default,
  ...teams.default,
  ...telemetry.default,
};
