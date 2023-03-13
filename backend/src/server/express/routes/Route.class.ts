import { Model, Optional } from 'sequelize';

import { getIdParam } from '../helpers.js';

class Route {
  model: any;

  constructor(_model: any) {
    this.model = _model;
  }

  async getAll(
    req: any,
    res: { status: (arg0: number) => { (): any; new (): any; json: { (arg0: Model<any, any>[]): void; new (): any } } }
  ): Promise<void> {
    const results = await this.model.findAll();
    res.status(200).json(results);
  }

  async getById(
    req: any,
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: Model<any, any>): void; new (): any };
        send: { (arg0: string): void; new (): any };
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

  async create(
    req: { body: Optional<any, string> | undefined },
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: { (arg0: string): void; new (): any };
        end: { (): void; new (): any };
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

  async update(
    req: { body: { [x: string]: any } },
    res: { status: (arg0: number) => { (): any; new (): any; end: { (): void; new (): any } } }
  ): Promise<void> {
    const id = getIdParam(req);
    await this.model.update(req.body, {
      where: {
        id: id,
      },
    });
    res.status(200).end();
  }

  async remove(
    req: any,
    res: { status: (arg0: number) => { (): any; new (): any; end: { (): void; new (): any } } }
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

export default Route;
