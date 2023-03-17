import { APIRequest, APIResult, SequelizeModel } from '../../../interfaces.js';
import ModelRoute from './ModelRoute.class.js';

/** CLASS: room
 * @description: This class matches with the room model in the DB.
 * @extends ModelRoute
 * @param {SequelizeModel} _model - The model that is used for the route.
 * @returns {room} - The room object.
 */

class room extends ModelRoute {
  constructor(_model: SequelizeModel) {
    super(_model);
  }

  async getRoomByStationName(req: APIRequest, res: APIResult): Promise<void> {
    const station_name = req.params.station_name;
    const room = await this.model.findAll({ where: { station_name: station_name } });
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).send('404 - Not found');
    }
  }
}

export default room;
