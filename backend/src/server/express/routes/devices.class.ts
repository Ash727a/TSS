import { APIRequest, APIResult } from '../../../interfaces.js';
import { SequelizeModel } from '../../../interfaces.js';
import ModelRoute from './ModelRoute.class.js';

/** CLASS: devices
 * @description: This class matches with the devices model in the DB.
 * @extends ModelRoute
 * @param {SequelizeModel} _model - The model that is used for the route.
 * @returns {devices} - The devices object.
 */
class devices extends ModelRoute {
  constructor(_model: SequelizeModel) {
    super(_model);
  }

  /**
   * Get all completed stations where the session_log_id is the queried one
   */
  async updateRoverRoomID(req: APIRequest, res: APIResult): Promise<void> {
    const room_id = req.body.room_id;
    const result = await this.model.update({ room_id: room_id }, { where: { name: 'rover' } });
    if (result) {
      res.status(200).json(res);
    } else {
      res.status(404).send('404 - Not found');
    }
  }
}

export default devices;
