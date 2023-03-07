import sequelize from '../../../database/index.js';
import { getIdParam } from '../helpers.js';

const models = sequelize.models;

async function getAll(req, res): Promise<void> {
  const simulationstateuias = await models.simulationstateuia.findAll();
  res.status(200).json(simulationstateuias);
}

async function getById(req, res): Promise<void> {
  const id = getIdParam(req);
  const simulationstateuia = await models.simulationstateuia.findByPk(id);
  if (simulationstateuia) {
    res.status(200).json(simulationstateuia);
  } else {
    res.status(404).send('404 - Not found');
  }
}

async function getByRoomId(req, res): Promise<void> {
  const id = req.params.room;
  const simulationstateuia = await models.simulationstateuia.findAll({ where: { room: id } });
  if (simulationstateuia) {
    res.status(200).json(simulationstateuia);
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
    await models.simulationstateuia.create(req.body);
    res.status(201).end();
  }
}

async function update(req, res): Promise<void> {
  const id = getIdParam(req);
  await models.simulationstateuia.update(req.body, {
    where: {
      id: id,
    },
  });
  res.status(200).end();
}

async function remove(req, res): Promise<void> {
  const id = getIdParam(req);
  await models.simulationstateuia.destroy({
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
