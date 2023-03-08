import { Model, Optional } from 'sequelize';

import sequelize from '../../../database/index.js';
import { getIdParam } from '../helpers.js';

const models = sequelize.models;

async function getAll(
  req: any,
  res: { status: (arg0: number) => { (): any; new (): any; json: { (arg0: Model<any, any>[]): void; new (): any } } }
): Promise<void> {
  const simulationfailures = await models.simulationfailure.findAll();
  res.status(200).json(simulationfailures);
}

async function getById(
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
  const simulationfailure = await models.simulationfailure.findByPk(id);
  if (simulationfailure) {
    res.status(200).json(simulationfailure);
  } else {
    res.status(404).send('404 - Not found');
  }
}

async function getByRoomId(
  req: { params: { room: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: Model<any, any>[]): void; new (): any };
      send: { (arg0: string): void; new (): any };
    };
  }
): Promise<void> {
  const id = req.params.room;
  const simulationfailure = await models.simulationfailure.findAll({ where: { room: id } });
  if (simulationfailure) {
    res.status(200).json(simulationfailure);
  } else {
    res.status(404).send('404 - Not found');
  }
}

async function create(
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
    await models.simulationfailure.create(req.body);
    res.status(201).end();
  }
}

async function update(
  req: { body: { [x: string]: any } },
  res: { status: (arg0: number) => { (): any; new (): any; end: { (): void; new (): any } } }
): Promise<void> {
  const id = getIdParam(req);
  await models.simulationfailure.update(req.body, {
    where: {
      id: id,
    },
  });
  res.status(200).end();
}

async function remove(
  req: any,
  res: { status: (arg0: number) => { (): any; new (): any; end: { (): void; new (): any } } }
): Promise<void> {
  const id = getIdParam(req);
  await models.simulationfailure.destroy({
    where: {
      id: id,
    },
  });
  res.status(200).end();
}

export default {
  getAll,
  getById,
  create,
  update,
  remove,
  getByRoomId,
};
