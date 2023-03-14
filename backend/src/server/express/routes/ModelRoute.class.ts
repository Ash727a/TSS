import { Model, Optional } from 'sequelize';

import { getIdParam } from '../helpers.js';
import Route from './Route.class.js';

/** CLASS: ModelRoute
 * @description This class is a generic class for all routes that are based on a model.
 * @param {any} _model - The model that is used for the route.
 * @returns {ModelRoute} - The ModelRoute object.
 */
class ModelRoute extends Route {
  public model: any;
  constructor(_model: any) {
    super();
    console.log('got model: ', _model);
    this.model = _model;
  }

  /**
   * GETTER: model
   * @returns {any} - The model that is used for the route.
   */
  public getModel(): any {
    return this.model;
  }

  /**
   * GET ALL /api/{model's name}
   * @param {*} req
   * @param {*} res
   * @returns {any[]}
   */
  async getAll(
    req: any,
    res: { status: (arg0: number) => { (): any; (): any; json: { (arg0: Model<any, any>[]): void; (): any } } }
  ): Promise<void> {
    console.log('model: ', this);
    console.log('model ooo : ', this.model);
    const results = await this?.model.findAll();
    res.status(200).json(results);
  }

  /**
   * GET SINGLE by id /api/{model's name}/:id
   * @param {*} req
   * @param {*} res
   * @returns {ant}
   * @throws 404 - Not found
   */
  async getById(
    req: any,
    res: {
      status: (arg0: number) => {
        (): any;
        (): any;
        json: { (arg0: Model<any, any>): void; (): any };
        send: { (arg0: string): void; (): any };
      };
    }
  ): Promise<void> {
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
   * @param {*} req
   * @param {*} res
   * @throws 400 - Bad request
   */
  async create(
    req: { body: Optional<any, string> | undefined },
    res: {
      status: (arg0: number) => {
        (): any;
        (): any;
        send: { (arg0: string): void; (): any };
        end: { (): void; (): any };
      };
    }
  ): Promise<void> {
    if (req?.body?.id) {
      res
        .status(400)
        .send(`Bad request: ID should not be provided, since it is determined automatically by the database.`);
    } else {
      await this.model.create(req.body);
      res.status(201).end();
    }
  }

  /**
   * PUT SINGLE /api/{model's name}/:id
   * @param {*} req
   * @param {*} res
   */
  async update(
    req: { body: { [x: string]: any } },
    res: { status: (arg0: number) => { (): any; (): any; end: { (): void; (): any } } }
  ): Promise<void> {
    const id = getIdParam(req);
    await this.model.update(req.body, {
      where: {
        id: id,
      },
    });
    res.status(200).end();
  }

  /**
   * DELETE SINGLE by id /api/{model's name}/:id
   * @param {*} req
   * @param {*} res
   */
  async remove(
    req: any,
    res: { status: (arg0: number) => { (): any; (): any; end: { (): void; (): any } } }
  ): Promise<void> {
    const id = getIdParam(req);
    await this.model.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).end();
  }
}

export default ModelRoute;
