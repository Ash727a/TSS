import { IAllModels } from '../../../database/models/index.js';
import { primaryKeyOf } from '../../../helpers.js';
import { APIRequest, APIResult, SequelizeModel } from '../../../interfaces.js';
import ModelRoute from './ModelRoute.class.js';

/** CLASS: specScanLog
 * @description: This class matches with the specScanLog model in the DB.
 * @extends ModelRoute
 * @param {SequelizeModel} _model - The model that is used for the route.
 * @returns {specScanLog} - The specScanLog object.
 */
class specScanLog extends ModelRoute {
  constructor(_model: SequelizeModel) {
    super(_model);
  }

  /**
   * Get all spec scans where the session_log_id is the queried one
   */
  async findAllWithSessionLogID(req: APIRequest, res: APIResult): Promise<void> {
    const session_log_id = req.params.session_log_id;
    const specLogs = await this.model.findAll({ where: { session_log_id: session_log_id } });
    if (specLogs) {
      res.status(200).json(specLogs);
    } else {
      res.status(404).send('404 - Not found');
    }
  }
}

export default specScanLog;
