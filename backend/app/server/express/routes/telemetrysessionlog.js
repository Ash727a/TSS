/**
 * Telemetry Session Logs
 * - multiple sessions can be created for each room
 * - see telemetrysessionlog.model.js for more details
 */
const { models } = require('../../../database/sequelize');
const { getIdParam } = require('../helpers');

const Model = models.telemetrysessionlog; // Define database model here

/**
 * GET ALL /api/telemetrysessionlog
 * @param {*} req
 * @param {*} res
 * @returns {TelemetrySessionLog[]}
 */
async function getAll(req, res) {
  const results = await Model.findAll({ order: [['start_time', 'DESC']]});
  res.status(200).json(results);
}

/**
 * GET SINGLE by id /api/telemetrysessionlog/:id
 * @param {*} req
 * @param {*} res
 * @returns {TelemetrySessionLog}
 * @throws 404 - Not found
 */
async function getById(req, res) {
  const id = getIdParam(req);
  const result = await Model.findByPk(id);
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(404).send('404 - Not found');
  }
}

/**
 * GET MULTIPLE by room id /api/telemetrysessionlog/room/:room
 * @param {*} req
 * @param {*} res
 * @returns {TelemetrySessionLog[]}
 * @throws 404 - Not found
 */
async function getByRoomId(req, res) {
  const id = req.params.room;
  const results = await Model.findAll({ where: { room: id } });
  if (results) {
    res.status(200).json(results);
  } else {
    res.status(404).send('404 - Not found');
  }
}

/**
 * POST SINGLE /api/telemetrysessionlog
 * @param {*} req
 * @param {*} res
 * @throws 400 - Bad request
 */
async function create(req, res) {
  if (req.body.id) {
    res
      .status(400)
      .send(`Bad request: ID should not be provided, since it is determined automatically by the database.`);
  } else {
    await Model.create(req.body);
    res.status(201).end();
  }
}

/**
 * PUT SINGLE /api/telemetrysessionlog/:id
 * @param {*} req
 * @param {*} res
 */
async function update(req, res) {
  const id = getIdParam(req);
  await Model.update(req.body, {
    where: {
      id: id,
    },
  });
  res.status(200).end();
}

/**
 * DELETE SINGLE by id /api/telemetrysessionlog/:id
 * @param {*} req
 * @param {*} res
 */
async function remove(req, res) {
  const id = getIdParam(req);
  await Model.destroy({
    where: {
      id: id,
    },
  });
  res.status(200).end();
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  getByRoomId,
};
