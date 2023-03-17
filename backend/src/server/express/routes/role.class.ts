import { SequelizeModel } from '../../../interfaces.js';
import ModelRoute from './ModelRoute.class.js';

/** CLASS: role
 * @description: This class matches with the role model in the DB.
 * @extends ModelRoute
 * @param {SequelizeModel} _model - The model that is used for the route.
 * @returns {role} - The role object.
 */
class role extends ModelRoute {
  constructor(_model: SequelizeModel) {
    super(_model);
  }
}

export default role;
