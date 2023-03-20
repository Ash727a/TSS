import { primaryKeyOf } from '../../../helpers.js';
import { APIRequest, APIResult, SequelizeModel } from '../../../interfaces.js';
import { getIdParam } from '../helpers.js';
import Route from './Route.class.js';

/** CLASS: ModelRoute
 * @description This class is a generic class for all routes that are based on a model.
 * @extends Route
 * @param {SequelizeModel} _model - The model that is used for the route.
 * @returns {ModelRoute} - The ModelRoute object.
 */
class ModelRoute extends Route {
  public readonly model: SequelizeModel;
  constructor(_model: SequelizeModel) {
    super();
    this.model = _model;
  }

  /**
   * GETTER: model
   * @returns {SequelizeModel} - The model that is used for the route.
   */
  public getModel(): SequelizeModel {
    return this.model;
  }

  /**
   * GET ALL /api/{model's name}
   * @param {APIRequest} req
   * @param {APIResult} res
   * @returns {any[]}
   */
  async getAll(req: APIRequest, res: APIResult): Promise<void> {
    const results = await this?.model.findAll();
    res.status(200).json(results);
  }

  /**
   * GET SINGLE by id /api/{model's name}/:id
   * @param {APIRequest} req
   * @param {APIResult} res
   * @returns {any}
   * @throws 404 - Not found
   */
  async getById(req: APIRequest, res: APIResult): Promise<void> {
    const id = getIdParam(req);
    const result = await this.model.findByPk(id);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).send('404 - Not found');
    }
  }

  /**
   * POST SINGLE /api/{model's name}
   * @param {APIRequest} req
   * @param {APIResult} res
   * @throws 400 - Bad request
   */
  async create(req: APIRequest, res: APIResult): Promise<void> {
    if (req?.body?.id) {
      res
        .status(400)
        .send('Bad request: ID should not be provided, since it is determined automatically by the database.');
    } else {
      await this.model.create(req.body);
      res.status(201).end();
    }
  }

  /**
   * PUT SINGLE /api/{model's name}/:id
   * @param {APIRequest} req
   * @param {APIResult} res
   */
  async update(req: APIRequest, res: APIResult): Promise<void> {
    const id = getIdParam(req);
    await this.model.update(req.body, {
      where: {
        [primaryKeyOf(this.model)]: id,
      },
    });
    res.status(200).end();
  }

  /**
   * DELETE SINGLE by id /api/{model's name}/:id
   * @param {APIRequest} req
   * @param {APIResult} res
   */
  async remove(req: APIRequest, res: APIResult): Promise<void> {
    const id = getIdParam(req);
    await this.model.destroy({
      where: {
        [primaryKeyOf(this.model)]: id,
      },
    });
    res.status(200).end();
  }
}

export default ModelRoute;
