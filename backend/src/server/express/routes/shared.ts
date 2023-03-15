import { Model } from 'sequelize';

/** EXPORT MODULE: shared
 * @fileoverview Exports shared functions in the routes directory.
 * @module shared
 * @category shared
 */

/**
 * GET MULTIPLE by room id /api/{model's name}/room/:room
 * @param {any} model a sequelize model
 * @param {*} req
 * @param {*} res
 * @returns {any[]}
 * @throws 404 - Not found
 */
async function getByRoomID(
  model: any,
  req: { params: { room: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      (): any;
      json: { (arg0: Model<any>[]): void; (): any };
      send: { (arg0: string): void; (): any };
    };
  }
): Promise<void> {
  const id = req.params.room;
  const results = await model.findAll({ where: { room_id: id } });
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(404).send('404 - Not found');
  }
}

export { getByRoomID };
