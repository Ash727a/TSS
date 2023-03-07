import sequelize from '../../../database/index.js';
import { getIdParam } from '../helpers.js';

const models = sequelize.models;

async function getAll(req, res): Promise<void> {
  const rooms = await models.room.findAll();
  res.status(200).json(rooms);
}

// async function getAllRoomsWithUsers(req, res): Promise<void> {
//   const rooms = await models.room.sequelize.query(`SELECT * FROM rooms INNER JOIN users ON rooms.id = users.room`);
//   res.status(200).json(rooms[0]);
// }

async function getById(req, res): Promise<void> {
  const id = getIdParam(req);
  const room = await models.room.findByPk(id);
  if (room) {
    res.status(200).json(room);
  } else {
    res.status(404).send('404 - Not found');
  }
}

async function getRoomByStationName(req, res): Promise<void> {
  const stationName = req.params.stationName;
  const room = await models.room.findAll({ where: { stationName: stationName } });
  if (room) {
    res.status(200).json(room);
  } else {
    res.status(404).send('404 - Not found');
  }
}

async function create(req, res): Promise<void> {
  if (req.body.id) {
    res
      .status(400)
      .send('Bad request: ID should not be provided, since it is determined automatically by the database.');
  } else {
    await models.room.create(req.body);
    res.status(201).end();
  }
}

async function update(req, res): Promise<void> {
  const id = getIdParam(req);

  // We only accept an UPDATE request if the `:id` param matches the body `id`
  if (req.body.id === id) {
    await models.room.update(req.body, {
      where: {
        id: id,
      },
    });
    res.status(200).end();
  } else {
    res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
  }
}

async function remove(req, res): Promise<void> {
  const id = getIdParam(req);
  await models.room.destroy({
    where: {
      id: id,
    },
  });
  res.status(200).end();
}

export default {
  getAll,
  // getAllRoomsWithUsers,
  getById,
  getRoomByStationName,
  create,
  update,
  remove,
};
