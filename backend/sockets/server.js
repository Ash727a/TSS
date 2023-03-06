const http = require('http');
const SocketServer = require('ws');
const Parser = require('./events/parser');
const Event = require('./events/event');
const User = require('./events/connect');
const dotenv = require('dotenv');
const path = require('path');

const envPath = path.join(__dirname, '../', '.env');
dotenv.config({ path: envPath });

const SOCKET_PORT = process.env.SOCKET_PORT;
const API_URL = process.env.API_URL + process.env.API_PORT;
const server = http.createServer();
const wss = new SocketServer.WebSocketServer({ server });
const STOP_SIM_URL = `${API_URL}/api/simulationcontrol/sim/`
const HMD_UPDATE_INTERVAL = 2000; //Milliseconds
const { models } = require('../sequelize');

let parser = new Parser();
let duplicate = false;

wss.on('connection', (ws, req) => {
	console.log(`*** USER CONNECTED ***`);

	let user = null;

	ws.on('message', async (data) => {
		console.log(`** MESSAGE RECEIVED **`);

		data = JSON.parse(data.toString('utf-8'));
		//console.log(data);
		let msgtype = data.MSGTYPE;
		let header = data.BLOB;
		let datatype = header.DATATYPE;
		let msgdata = header.DATA;


		//Client messages are always DATA
		if (msgtype !== "DATA") {
			console.log(msgdata);
			ws.send(JSON.stringify({ ERR: "MSGTYPE isn't DATA" }));
			return;
		}

		if (datatype == "CREWMEMBER") {
			const room_id = msgdata.room_id;
			const username = msgdata.username;
			const client_id = msgdata.client_id;

			user = new User(username, client_id, room_id);

			// Register the user in the database and assign them to room
			duplicate = await user.registerUser(msgdata, models);

			// Add the client to the room
			if (!duplicate) {
				ws.roomId = room_id;
				setInterval(() => sendData(), HMD_UPDATE_INTERVAL);
			}
			else {
				ws.send("Connection failed, duplicate sign on attempt.")
				ws.close(1008, 'Duplicate user');
				console.log(`Connection Failed: Duplicate User.`);
			}
		}

		if (datatype == "IMU") {
			console.log(msgdata);
			parser.parseMessageIMU(msgdata, models);
		}

		if (datatype == "GPS") {
			console.log(msgdata);
			parser.parseMessageGPS(msgdata, models);
		}
	});

	//setInterval(async function() {
	async function sendData() {
		try {
			const room_id = ws.roomId;
			let sim_state = await models.simulationstate.findOne({ where: { room: room_id } });
			//let gps_val  = await models.gpsmsg.findAll({ where: { room_id: room_id }});
			//let imu_val  = await models.imumsg.findAll({ where: { room_id: room_id }});
			let telem_val = await models.simulationstate.findAll({ where: { room: room_id } });

			const data = {
				//gpsmsgs: gps_val,
				//imumsgs: imu_val,
				simulationstates: telem_val
				/*
					add spectrometer data
					add rover data 
				*/
			};

			if (sim_state.isRunning) {
				ws.send(JSON.stringify(data));
			}

		} catch (err) {
			console.error('Error:', err);
		}

	};

	ws.on('close', async () => {
		console.log(`*** USER DISCONNECTED ***`);
		if (ws.roomId) {
			// stop sim s
			http.get(STOP_SIM_URL + `${ws.roomId}/stop`);
			// remove the client from the assigned room
			const room = await models.room.findOne({ where: { id: ws.roomId } });
			room.client_id = null;
			await room.save();
			console.log(`Client removed from room ${room.name}`);
		}
		// close the connection
		ws.terminate();
	});
});

function unassignAllRooms() {
	console.log("here");
	try {
		models.room.update({ client_id: null }, { where: { client_id: { [models.not]: null } } }).then(() => {
			console.log('All rooms unassigned');
		}).catch((err) => {
			console.error('Error unassigning rooms:', err);
		});
	} catch (e) {
		console.log(e);
	}
}

process.on('SIGINT', () => {
	console.log('Received SIGINT signal, shutting down server...');
	unassignAllRooms();
	server.close(() => {
		console.log('Server has been gracefully shutdown.');
		process.exit(0);
	});
});



server.listen(SOCKET_PORT, () => {
	console.log(`SUITS Socket Server listening on: ${SOCKET_PORT}`);
});
