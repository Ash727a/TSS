import { IAllModels } from '../../../database/models/index.js';
import { primaryKeyOf } from '../../../helpers.js';
import { APIRequest, APIResult, SequelizeModel } from '../../../interfaces.js';
import ModelRoute from './ModelRoute.class.js';

/** CLASS: rover
 * @description: This class matches with the rover model in the DB.
 * @extends ModelRoute
 * @param {SequelizeModel} _model - The model that is used for the route.
 * @returns {rover} - The rover object.
 */
class rover extends ModelRoute {
  private room_model: SequelizeModel;
  constructor(_model: SequelizeModel, room_model: SequelizeModel) {
    super(_model);
    this.room_model = room_model;
  }
}

export default rover;
