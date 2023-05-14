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

  //   async updateRover(req: APIRequest, res: APIResult): Promise<void> {
  //     const roomInRover = await this.room_model
  //       .findOne({
  //         attributes: ['id'],
  //         where: {
  //           station_name: 'ROV',
  //         },
  //       })
  //       .catch((e) => {
  //         console.log(e);
  //       });

  //     if (roomInRover === null) {
  //       res.status(200).send('No room in rover');
  //       console.log('No room in rover');
  //       return;
  //     }
  //     const id = roomInRover?.get('id');
  //     // Check if the rover is a new assignment, or it has already been assigned
  //     const _rover: any = await this.model.findOne({
  //       where: {
  //         [primaryKeyOf(this.model)]: id,
  //       },
  //     });

  //     if (_rover === null) {
  //       res.status(200).send('No rover in DB');
  //       console.log('No rover in DB');
  //       return;
  //     }

  //     // If it's a new connection, there's no started_at
  //     if (!_rover.started_at) {
  //       req.body.started_at = new Date();
  //     }

  //     await this.model.update(req.body, {
  //       where: {
  //         [primaryKeyOf(this.model)]: id,
  //       },
  //     });

  //     res.status(200).end();
  //   }
}

export default rover;
