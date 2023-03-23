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

const allModels = {
  ...logging.default,
  role,
  room,
  ...stations.default,
  ...teams.default,
  ...telemetry.default,
};
export default allModels;
export type IAllModels = typeof allModels;

/** EXPORT MODULE: liveModels
 * @fileoverview Exports all live TSS models in the models directory.
 * @module liveModels
 * @category models
 */
export const liveModels = {
  role,
  room,
  ...stations.default,
  ...teams.default,
  ...telemetry.default,
};
export type ILiveModels = typeof liveModels;

/** EXPORT MODULE: logModels
 * @fileoverview Exports all log TSS models in the models directory.
 * @module logModels
 */
export const logModels = {
  ...logging.default,
};
export type ILogModels = typeof liveModels;
