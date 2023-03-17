import { SequelizeModel } from '../../../interfaces.js';
import ModelRoute from './ModelRoute.class.js';

/** CLASS: simulationFailure
 * @description: This class matches with the simulationFailure model in the DB.
 * @extends ModelRoute
 * @param {SequelizeModel} _model - The model that is used for the route.
 * @returns {simulationFailure} - The simulationFailure object.
 */
class simulationFailure extends ModelRoute {
  constructor(_model: SequelizeModel) {
    super(_model);
  }
}

export default simulationFailure;
