/**
 * Telemetry Session Logs
 * - multiple sessions can be created for each room
 * - see telemetrySessionLog.model.js for more details
 */
import { Model, Optional } from 'sequelize';

import sequelize from '../../../database/index.js';
import { getIdParam } from '../helpers.js';

const models = sequelize.models;

const model = models.telemetrySessionLog; // Define database model here

/**
 * GET ALL /api/telemetrySessionLog
 * @param {*} req
 * @param {*} res
 * @returns {TelemetrySessionLog[]}
 */
async function getAll(
  req: any,
  res: { status: (arg0: number) => { (): any; (): any; json: { (arg0: Model<any, any>[]): void; (): any } } }
): Promise<void> {
  const results = await model.findAll({ order: [['start_time', 'DESC']] });
  res.status(200).json(results);
}

/**
 * GET SINGLE by id /api/telemetrySessionLog/:id
 * @param {*} req
 * @param {*} res
 * @returns {TelemetrySessionLog}
 * @throws 404 - Not found
 */
async function getById(
  req: any,
  res: {
    status: (arg0: number) => {
      (): any;
      (): any;
      json: { (arg0: any): void; (): any };
      send: { (arg0: string): void; (): any };
    };
  }
): Promise<void> {
  const id = getIdParam(req);
  const result = await model.findByPk(id);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).send('404 - Not found');
  }
}

/**
 * POST SINGLE /api/telemetrySessionLog
 * @param {*} req
 * @param {*} res
 * @throws 400 - Bad request
 */
async function create(
  req: { body: Optional<any, never> | undefined },
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
    await model.create(req.body);
    res.status(201).end();
  }
}

/**
 * PUT SINGLE /api/telemetrySessionLog/:id
 * @param {*} req
 * @param {*} res
 */
async function update(
  req: { body: any },
  res: { status: (arg0: number) => { (): any; (): any; end: { (): void; (): any } } }
): Promise<void> {
  const id = getIdParam(req);
  await model.update(req.body, {
    where: {
      id: id,
    },
  });
  res.status(200).end();
}

/**
 * DELETE SINGLE by id /api/telemetrySessionLog/:id
 * @param {*} req
 * @param {*} res
 */
async function remove(
  req: any,
  res: { status: (arg0: number) => { (): any; (): any; end: { (): void; (): any } } }
): Promise<void> {
  const id = getIdParam(req);
  await model.destroy({
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
