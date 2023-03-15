import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { Op } from 'sequelize';
import WebSocket, { Server } from 'ws';

import sequelize from '../../database/index.js';
import { primaryKeyOf } from '../../helpers.js';
import User from './events/connect.js';
import Event from './events/event.js';
import Parser from './events/parser.js';

const models = sequelize.models;

const envPath = path.join(__dirname, '../', '.env');
dotenv.config({ path: envPath });

const SOCKET_PORT = process.env.SOCKET_PORT;
const API_URL = `${process.env.API_URL as string}:${process.env.API_PORT as number | undefined}`;
const server = http.createServer();
const wss = new WebSocket.Server({ server });
const STOP_SIM_URL = `${API_URL}/api/simulationControl/sim/`;
const HMD_UPDATE_INTERVAL = 2000; //Milliseconds

const parser = new Parser();
let duplicate = false;

wss.on('connection', (ws: any, req) => {
  console.log(`*** USER CONNECTED ***`);

  ws.on('message', async (data: any) => {
    console.log(`** MESSAGE RECEIVED **`);

    data = JSON.parse(data.toString('utf-8'));
    //console.log(data);
    const msgtype = data.MSGTYPE;
    const header = data.BLOB;
    const datatype = header.DATATYPE;
    const msgdata = header.DATA;

    //Client messages are always DATA
    if (msgtype !== 'DATA') {
      console.log(msgdata);
      ws.send(JSON.stringify({ ERR: "MSGTYPE isn't DATA" }));
      return;
    }

    if (datatype == 'CREWMEMBER') {
      const room_id = msgdata.room_id;
      const username = msgdata.username;
      const client_id = msgdata.client_id;

      const user = new User(username, client_id, room_id);
      if (user) {
        // Register the user in the database and assign them to room
        duplicate = await user.registerUser(msgdata, models);
      }

      // Add the client to the room
      if (!duplicate) {
        ws.roomId = room_id;
        setInterval(() => sendData(), HMD_UPDATE_INTERVAL);
      } else {
        ws.send('Connection failed, duplicate sign on attempt.');
        ws.close(1008, 'Duplicate user');
        console.log(`Connection Failed: Duplicate User.`);
      }
    }

    if (datatype == 'IMU') {
      console.log(msgdata);
      parser.parseMessageIMU(msgdata, models);
    }

    if (datatype == 'GPS') {
      console.log(msgdata);
      parser.parseMessageGPS(msgdata, models);
    }
  });

  //setInterval(async function() {
  async function sendData(): Promise<void> {
    try {
      const room_id = ws.roomId;
      const sim_state_res = await models.simulationState.findOne({
        where: { [primaryKeyOf(models.simulationState)]: room_id },
      });
      const sim_state = sim_state_res?.get({ plain: true });
      //let gps_val  = await models.gpsMsg.findAll({ where: { room_id: room_id }});
      //let imu_val  = await models.imuMsg.findAll({ where: { room_id: room_id }});
      const telem_val = await models.simulationState.findAll({
        where: { [primaryKeyOf(models.simulationState)]: room_id },
      });

      const data = {
        //gpsMsg: gps_val,
        //imuMsg: imu_val,
        simulationStates: telem_val,
        /*
          add spectrometer data
          add rover data 
        */
      };

      if (sim_state?.is_running) {
        ws.send(JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }

  ws.on('close', async () => {
    console.log(`*** USER DISCONNECTED ***`);
    if (ws.roomId) {
      // stop sim s
      http.get(STOP_SIM_URL + `${ws.roomId}/stop`);
      // remove the client from the assigned room
      const room: any = await models.room.findOne({ where: { [primaryKeyOf(models.room)]: ws.roomId } });
      room.client_id = null;
      await room.save();
      console.log(`Client removed from room ${room.name}`);
    }
    // close the connection
    ws.terminate();
  });
});

function unassignAllRooms(): void {
  console.log('here');
  try {
    models.room
      .update({ client_id: null }, { where: { client_id: { [Op.ne]: null } } })
      .then(() => {
        console.log('All rooms unassigned');
      })
      .catch((err) => {
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
