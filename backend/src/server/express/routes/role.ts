import { Model, Optional } from 'sequelize';

import sequelize from '../../../database/index.js';
import { getIdParam } from '../helpers.js';

const models = sequelize.models;

async function getAll(res: {
  status: (arg0: number) => { (): any; new (): any; json: { (arg0: Model<any, any>[]): void; new (): any } };
}): Promise<void> {
  const roles = await models.role.findAll();
  res.status(200).json(roles);
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
  const role = await models.role.findByPk(id);
  if (role) {
    res.status(200).json(role);
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
    await models.role.create(req.body);
    res.status(201).end();
  }
}

async function update(
  req: { body: { [x: string]: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      end: { (): void; new (): any };
      send: { (arg0: string): void; new (): any };
    };
  }
): Promise<void> {
  const id = getIdParam(req);

  // We only accept an UPDATE request if the `:id` param matches the body `id`
  if (req.body.id === id) {
    await models.role.update(req.body, {
      where: {
        id: id,
      },
    });
    res.status(200).end();
  } else {
    res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
  }
}

async function remove(
  req: any,
  res: { status: (arg0: number) => { (): any; new (): any; end: { (): void; new (): any } } }
): Promise<void> {
  const id = getIdParam(req);
  await models.role.destroy({
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
};
