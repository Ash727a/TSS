import { APIRequest, APIResult, SequelizeModel } from '../../../interfaces.js';
import HasRoomID from './HasRoomID.interface.js';
import ModelRoute from './ModelRoute.class.js';
import * as shared from './shared.js';

/** CLASS: telemetryErrorLog
 * @description: This class matches with the telemetryErrorLog model in the DB.
 * @extends ModelRoute
 * @implements {HasRoomID}
 * @param {SequelizeModel} _model - The model that is used for the route.
 * @returns {telemetryErrorLog} - The telemetryErrorLog object.
 */
class telemetryErrorLog extends ModelRoute implements HasRoomID {
  constructor(_model: SequelizeModel) {
    super(_model);
  }

  /* See shared.ts for getByRoomId function definition */
  async getByRoomID(req: APIRequest, res: APIResult): Promise<void> {
    return await shared.getByRoomID(this.model, req, res);
  }
}

export default telemetryErrorLog;
