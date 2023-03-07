const { v4: uuidv4 } = require('uuid');
const { models } = require('../database');
const { simulationStep } = require('./telemetry/eva_telemetry')
const simStateSeed = require('./seed/simstate.json');
const simControlSeed = require('./seed/simcontrol.json');
const simFailureSeed = require('./seed/simfailure.json');
// var SimulationState = mongoose.model('SimulationState')
// var SimulationControl = mongoose.model('SimulationControl')
// var SimulationFailure = mongoose.model('SimulationFailure')
require('dotenv').config();

class EVASimulation {
	simTimer = null;
	simStateID = null;
	simControlID = null;
	simFailureID = null;
	holdID = null;
	lastTimestamp = null;
	session_id = null;
	room;

	// Data Objects
	simState = {};
	simControls = {};
	simFailure = {};

	constructor(_room_id, _session_id) {
		this.room = _room_id;
		this.session_id = _session_id;
		this.seedInstances();
	}

	async seedInstances() {

		// Get the instances for the room
		let state = await models.simulationstate.findOne({ where: { room: parseInt(this.room) } });
		let control = await models.simulationcontrol.findOne({ where: { room: parseInt(this.room) } });
		let failure = await models.simulationfailure.findOne({ where: { room: parseInt(this.room) } });

		// Seed the states on start
		await models.simulationstate.update(simStateSeed, {
			where: { id: state.id }
		});
		await models.simulationcontrol.update(simControlSeed, {
			where: { id: control.id }
		});
		await models.simulationfailure.update(simFailureSeed, {
			where: { id: failure.id }
		});
		console.log('Seed Completed');
	}

	isRunning() {
		return simStateID !== null && controlID !== null && failureID !== null
	}

	async start(roomid, session_id) {
		console.log('Starting Sim');
		this.simState = {};
		this.simControls = {};
		this.simFailure = {};

		// The sim started. Update the session id for the current room
		await models.room.update({session_id: session_id}, {where: {id: roomid}});
		// TODO

		await models.simulationstate.findAll({where: {room: roomid}})
			.then(data => {
				this.simState = data[0].dataValues;
			});

		if(this.simState.isRunning) {
			return false;
		}
		// Update isRunning
		this.simState.isRunning = true;

		await models.simulationcontrol.findAll({where: {room: roomid}}).then(data => {
			// console.log(data);
			this.simControls = data[0].dataValues;
		});

		await models.simulationfailure.findAll({where: {room: roomid}}).then(data => {			
			this.simFailure = data[0].dataValues;
		});

		await models.telemetrysessionlog.create({ room_id: roomid, session_id, start_time: Date.now() });

		this.simStateID   = this.simState.id;
		this.simControlID = this.simControls.id;
		this.simFailureID = this.simFailure.id;

		console.log('--------------Simulation Starting--------------')
		this.lastTimestamp = Date.now();
		this.simTimer = setInterval(() => {this.step();}, process.env.SIM_STEP_TIME);
	}

	isPaused() {
		return this.simTimer == null;
	}

	async pause() {
		if (!this.simState.isRunning) {
			throw new Error('Cannot pause: simulation is not running or it is running and is already paused')
		}
		console.log('--------------Simulation Paused-------------')

		clearInterval(this.simTimer);
		this.simTimer = null ;
		this.lastTimestamp = null;

		await models.simulationstate.update({isPaused: true}, {
			where: { id: this.simStateID }
		});
	}

	async unpause() {
		if (!this.simState.isRunning) {
			throw new Error('Cannot unpause: simulation is not running or it is running and is not paused')
		}

		console.log('--------------Simulation Resumed-------------')
		this.lastTimestamp = Date.now();
		this.simTimer = setInterval(() => {this.step();}, process.env.SIM_STEP_TIME);

		await models.simulationstate.update({isPaused: false}, {
			where: { id: this.simStateID }
		});
	}

	async stop() {
		if (!this.simState.isRunning) {
			throw new Error('Cannot stop: simulation is not running')
		}
		// this.simStateID = null
		// this.controlID = null
		// Update the room's session id to null, since the session has ended
		await models.room.update({session_id: ''}, {where: {id: this.room}});
		// Set the session's end time to now
		await models.telemetrysessionlog.update({end_time: Date.now()}, {where: {session_id: this.session_id}});
		clearInterval(this.simTimer)
		this.simTimer = null
		this.lastTimestamp = null
		console.log('--------------Simulation Stopped-------------')

		// Reseed here
		this.seedInstances();
	}

	async getState() {
		const simState = await models.SimulationState.findByPk(this.simStateID);
		// await SimulationState.findById(simStateID).exec()
		return simState
	}
	async getControls() {
		const controls = await models.SimulationControl.findByPk(this.simControlID);
		//await SimulationControl.findById(controlID).exec()
		return controls
	}

	async getFailure() {
		const failure = await models.SimulationFailure.findByPk(this.simFailureID);
		//await SimulationFailure.findById(failureID).exec()
		return failure
	}

	async setFailure(newFailure) {
		const failure = await models.simulationfailure.update(newFailure, {
			where: {
				id: this.simFailureID
			}
		});

		// Update Failure Object
		await models.simulationfailure.findAll({where: {room: this.room}}).then(data => {			
			this.simFailure = data[0].dataValues;
		});

		return failure
	}

	async setControls(newControls) {
		// const controls = await SimulationControl.findByIdAndUpdate(controlID, newControls, {new: true}).exec()
		const controls = await models.simulationcontrol.update(newControls, {
			where: {
				id: this.simControlID
			}
		});

		// Update Controls Object
		await models.simulationcontrol.findAll({where: {room: this.room}}).then(data => {
			this.simControls = data[0].dataValues;
		});

		return controls
	}

	async step() {
		console.log(`StateID: ${this.simStateID}, ControlID: ${this.simControlID}, FailureID: ${this.simFailureID}`);
		try{
			// const simState = await simulationstate.findById(this.simStateID).exec()
			// const controls = await simulationcontrol.findById(this.controlID).exec()
			const now = Date.now();
			const dt = now - this.lastTimestamp;
			this.lastTimestamp = now;
			// Get all simulation failures (new data) and udpate the simFailure object
			const failureData = await models.simulationfailure.findAll({where: {room: this.simFailureID}});
			const newSimFailure = failureData[0].dataValues;
			this.simFailure = { ...this.simFailure, ...newSimFailure };
			this.updateTelemetryErrorLogs();
			this.updateTelemetryStation();
			const newSimState = simulationStep(dt, this.simControls, this.simFailure, this.simState)
			Object.assign(this.simState, newSimState)
			// await simState.save()
			await models.simulationstate.update(this.simState, {
				where: {
					id: this.simStateID
				}
			}).then(() => {
				console.log('Updated');
			});
		}
		catch(error){
			console.error('failed error')
			console.error(error.toString())
		}
	}

	updateTelemetryErrorLogs() {
		const failureKeys = ['o2_error', 'pump_error', 'fan_error', 'battery_error'];
		let updatedErrors = {};
		// Loop through the keys to check for new error state changes
		failureKeys.forEach((key) => {
			// If the error is thrown, but the id is not set, set it.
			const error_id = this.simFailure[key + '_id'];
			if (this.simFailure[key] === true && (error_id === null || error_id === undefined || error_id === '')) {
				const errorID = uuidv4();
				// Set the error id for the current simulation
				this.simFailure[key + '_id'] = errorID;
				// Create log of the error in the DB (telemetryerrorlog table)
				models.telemetryerrorlog.create({
					id: errorID,
					session_id: this.session_id,
					room_id: this.room,
					error_type: key,
					start_time: new Date(),
				});
			// If the error fixed, set the end time and send the log to the DB
			} else if (this.simFailure[key] === false && (error_id !== null && error_id !== undefined && error_id !== '')) {
				// Send log to logs table in DB
				models.telemetryerrorlog.update({
					end_time: Date.now(),
					resolved: true,
				}, {
					where: {
						id: this.simFailure[key + '_id'],
					},
				});
				// Reset the error id
				this.simFailure[key + '_id'] = null;
			}
			// Add the new value to the error object to be updated
			updatedErrors[key + '_id'] = this.simFailure[key + '_id'];
		});
		// Update the simulation failure table with the new error ids

		models.simulationfailure.update(updatedErrors, {
			where: {
				id: this.room,
			},
		})
	}

	async updateTelemetryStation() {
		// TODO: This will have a bug of the station only being logged when the telemetry simulation is running
		// TODO: Edge case when one room's TSS stopped, but is still assigned to a room (maybe, or does it auto-unassign)
		// TODO: Edge case when one room's station is still assigned when the TSS stops -- this will cause the station in logs to never be completed
		const roomData = await models.room.findOne({where: {id: this.room}});
		const room = roomData.dataValues;
		console.log('checking for updates...')
		console.log(room)
		// If the room's station name is different than the current station name, it means a new station has been assigned to this room
		if (this.stationName !== room.stationName) {
			// If the previous station's id is not null, then we should end the previous station's log
			if (this.station_id !== null && this.station_id !== undefined && this.station_id !== '') {
				console.log('updating')
				// End the previous station's log
				models.telemetrystationlog.update({
					end_time: Date.now(),
					completed: true,
				}, {
					where: {
						id: this.station_id,
					},
				});
			}
			// If the room was assigned to a new station, we want to create a new station log
			if (room.stationName !== undefined && room.stationName !== null && room.stationName !== '') {
				console.log('creating')

				this.station_id = uuidv4();
				models.telemetrystationlog.create({
					id: this.station_id,
					session_id: this.session_id,
					room_id: this.room,
					station_name: room.stationName,
					start_time: Date.now()
				});
				// Update the room's station id with the new id
				models.room.update({
					station_id: this.station_id,
				}, {
					where: {
						id: this.room,
					},
				})
				console.log('created new station', this.station_id);
			}
		}
		// Update the current instances values
		this.stationName = room.stationName;
		this.station_id = room.station_id;

	}
}
module.exports = EVASimulation;
