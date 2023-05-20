import { IAllModels } from '../../../database/models/index.js';
import { primaryKeyOf } from '../../../helpers.js';
import { APIRequest, APIResult, SequelizeModel } from '../../../interfaces.js';
import ModelRoute from './ModelRoute.class.js';

/** CLASS: uiaState
 * @description: This class matches with the uiaState model in the DB.
 * @extends ModelRoute
 * @param {SequelizeModel} _model - The model that is used for the route.
 * @returns {uiaState} - The uiaState object.
 */
class uiaState extends ModelRoute {
  constructor(_model: SequelizeModel) {
    super(_model);
  }
}

export default uiaState;
