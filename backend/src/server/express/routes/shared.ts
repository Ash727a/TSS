import { APIRequest, APIResult, SequelizeModel } from '../../../interfaces.js';

/** EXPORT MODULE: shared
 * @fileoverview Exports shared functions in the routes directory.
 * @module shared
 * @category shared
 */

/**
 * GET MULTIPLE by room id /api/{model's name}/room/:room
 * @param {SequelizeModel} model a sequelize model
 * @param {APIRequest} req
 * @param {APIResult} res
 * @throws 404 - Not found
 */
async function getByRoomID(model: SequelizeModel, req: APIRequest, res: APIResult): Promise<void> {
  const id = req.params.room;
  const results = await model.findAll({ where: { room_id: id } });
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(404).send('404 - Not found');
  }
}

export { getByRoomID };
