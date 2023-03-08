import { Model, Optional } from 'sequelize';

import sequelize from '../../../database/index.js';
import { getIdParam } from '../helpers.js';

const models = sequelize.models;

async function getAll(
  req: any,
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: Model<any, any>[]): void; new (): any };
      send: { (arg0: string): void; new (): any };
    };
  }
): Promise<void> {
  const simulationstate = await models.simulationstate.findAll();
  if (simulationstate) {
    res.status(200).json(simulationstate);
  } else {
    res.status(404).send('404 - Not found');
  }
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
  const simulationstate = await models.simulationstate.findByPk(id);
  if (simulationstate) {
    res.status(200).json(simulationstate);
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
  const simulationstate = await models.simulationstate.findAll({ where: { room: id } });
  if (simulationstate) {
    res.status(200).json(simulationstate);
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
      .send('Bad request: ID should not be provided, since it is determined automatically by the database.');
  } else {
    await models.simulationstate.create(req.body);
    res.status(201).end();
  }
}

async function update(
  req: { body: { [x: string]: any } },
  res: { status: (arg0: number) => { (): any; new (): any; end: { (): void; new (): any } } }
): Promise<void> {
  const id = getIdParam(req);
  await models.simulationstate.update(req.body, {
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
  await models.simulationstate.destroy({
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
