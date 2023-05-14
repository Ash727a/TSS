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
}

export default devices;
