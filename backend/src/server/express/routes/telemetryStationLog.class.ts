import { APIRequest, APIResult, SequelizeModel } from '../../../interfaces.js';
import HasRoomID from './HasRoomID.interface.js';
import ModelRoute from './ModelRoute.class.js';
import * as shared from './shared.js';

/** CLASS: telemetryStationLog
 * @description: This class matches with the telemetryStationLog model in the DB.
 * @extends ModelRoute
 * @implements {HasRoomID}
 * @param {SequelizeModel} _model - The model that is used for the route.
 * @returns {telemetryStationLog} - The telemetryStationLog object.
 */
class telemetryStationLog extends ModelRoute implements HasRoomID {
  constructor(_model: SequelizeModel) {
    super(_model);
  }

  /* See shared.ts for getByRoomId function definition */
  async getByRoomID(req: APIRequest, res: APIResult): Promise<void> {
    return await shared.getByRoomID(this.model, req, res);
  }

  /**
   * Get all completed stations where the session_log_id is the queried one
   */
  async findCompletedStations(req: APIRequest, res: APIResult): Promise<void> {
    const session_log_id = req.params.session_log_id;
    const completedStations = await this.model.findAll({ where: { session_log_id: session_log_id, completed: true } });
    if (completedStations) {
      res.status(200).json(completedStations);
    } else {
      res.status(404).send('404 - Not found');
    }
  }
}

export default telemetryStationLog;
