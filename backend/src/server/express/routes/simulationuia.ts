import sequelize from '../../../database/index.js';
import { getIdParam } from '../helpers.js';

const models = sequelize.models;

async function getAll(req, res): Promise<void> {
  const simulationuias = await models.simulationuia.findAll();
  res.status(200).json(simulationuias);
}

async function getById(req, res): Promise<void> {
  const id = getIdParam(req);
  const simulationuia = await models.simulationuia.findByPk(id);
  if (simulationuia) {
    res.status(200).json(simulationuia);
  } else {
    res.status(404).send('404 - Not found');
  }
}

async function getByRoomId(req, res): Promise<void> {
  const id = req.params.room;
  const simulationuia = await models.simulationuia.findAll({ where: { room: id } });
  if (simulationuia) {
    res.status(200).json(simulationuia);
  } else {
    res.status(404).send('404 - Not found');
  }
}

async function create(req, res): Promise<void> {
  if (req.body.id) {
    res
      .status(400)
      .send(`Bad request: ID should not be provided, since it is determined automatically by the database.`);
  } else {
    await models.simulationuia.create(req.body);
    res.status(201).end();
  }
}

async function update(req, res): Promise<void> {
  const id = getIdParam(req);
  await models.simulationuia.update(req.body, {
    where: {
      id: id,
    },
  });
  res.status(200).end();
}

async function remove(req, res): Promise<void> {
  const id = getIdParam(req);
  await models.simulationuia.destroy({
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
