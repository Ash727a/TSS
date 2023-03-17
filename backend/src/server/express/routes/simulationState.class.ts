import { SequelizeModel } from '../../../interfaces.js';
import ModelRoute from './ModelRoute.class.js';

/** CLASS: simulationState
 * @description: This class matches with the simulationState model in the DB.
 * @extends ModelRoute
 * @param {SequelizeModel} _model - The model that is used for the route.
 * @returns {simulationState} - The simulationState object.
 */
class simulationState extends ModelRoute {
  constructor(_model: SequelizeModel) {
    super(_model);
  }
}

export default simulationState;
