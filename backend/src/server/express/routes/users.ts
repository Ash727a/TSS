import sequelize from '../../../database/index.js';
import { getIdParam } from '../helpers.js';

const models = sequelize.models;

async function getAll(req, res): Promise<void> {
  const users = await models.user.findAll();
  res.status(200).json(users);
}

async function getByRoomId(req, res): Promise<void> {
  const users = await models.user.findAll({ where: { room: req.params.room } });
  res.status(200).json(users);
}

async function getById(req, res): Promise<void> {
  const id = getIdParam(req);
  const user = await models.user.findByPk(id);
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).send('404 - Not found');
  }
}

async function getByName(req, res): Promise<void> {
  const user = await models.user.findAll({ where: { username: req.params.username } });
  res.status(200).json(user);
}

async function create(req, res): Promise<void> {
  if (req.body.id) {
    res
      .status(400)
      .send('Bad request: ID should not be provided, since it is determined automatically by the database.');
  } else {
    await models.user.create(req.body);
    res.status(201).end();
  }
}

async function update(req, res): Promise<void> {
  console.log('Attempting to update user');
  await models.user.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.status(200).end();
}

async function remove(req, res): Promise<void> {
  const id = getIdParam(req);
  await models.user.destroy({
    where: {
      id: id,
    },
  });
  res.status(200).end();
}

export default {
  getAll,
  getById,
  getByName,
  getByRoomId,
  create,
  update,
  remove,
};
