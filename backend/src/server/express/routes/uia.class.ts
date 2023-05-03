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
    // Check if the UIA is a new assignment, or it has already been assigned
    const _uia: any = await this.model.findOne({
      where: {
        [primaryKeyOf(this.model)]: id,
      },
    });

    if (_uia === null) {
      res.status(200).send('No UIA in DB');
      console.log('No UIA in DB');
      return;
    }

    // If it's a new connection, there's no started_at
    if (!_uia.started_at) {
      req.body.started_at = new Date();
    }
    console.log(_uia);

    console.log('here');
    console.log(req.body);
    await this.model.update(req.body, {
      where: {
        [primaryKeyOf(this.model)]: id,
      },
    });

    res.status(200).end();
  }
}

export default uia;
