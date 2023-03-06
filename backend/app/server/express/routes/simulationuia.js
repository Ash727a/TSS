const { models } = require('../../../database/sequelize');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	const simulationuias = await models.simulationuia.findAll();
	res.status(200).json(simulationuias);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const simulationuia = await models.simulationuia.findByPk(id);
	if (simulationuia) {
		res.status(200).json(simulationuia);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function getByRoomId(req, res) {
	const id = req.params.room;
	const simulationuia = await models.simulationuia.findAll({where: {room: id}});
	if (simulationuia) {
		res.status(200).json(simulationuia);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.simulationuia.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);
    await models.simulationuia.update(req.body, {
        where: {
            id: id
        }
    });
    res.status(200).end();
};

async function remove(req, res) {
	const id = getIdParam(req);
	await models.simulationuia.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

module.exports = {
	getAll,
	getById,
	create,
	update,
	remove,
    getByRoomId
};
