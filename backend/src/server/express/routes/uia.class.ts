import { IAllModels } from '../../../database/models/index.js';
import { primaryKeyOf } from '../../../helpers.js';
import { APIRequest, APIResult, SequelizeModel } from '../../../interfaces.js';
import ModelRoute from './ModelRoute.class.js';

/** CLASS: uia
 * @description: This class matches with the uia model in the DB.
 * @extends ModelRoute
 * @param {SequelizeModel} _model - The model that is used for the route.
 * @returns {uia} - The uia object.
 */
class uia extends ModelRoute {
  private room_model: SequelizeModel;
  constructor(_model: SequelizeModel, room_model: SequelizeModel) {
    super(_model);
    this.room_model = room_model;
  }

  async updateUIA(req: APIRequest, res: APIResult): Promise<void> {
    const roomInUIA = await this.room_model
      .findOne({
        attributes: ['id'],
        where: {
          station_name: 'UIA',
        },
      })
      .catch((e) => {
        console.log(e);
      });

    if (roomInUIA === null) {
      res.status(200).send('No room in UIA');
      console.log('No room in UIA');
      return;
    }

    const id = roomInUIA?.get('id');

    await this.model.update(req.body, {
      where: {
        [primaryKeyOf(this.model)]: id,
      },
    });

    res.status(200).end();
  }
}

export default uia;
