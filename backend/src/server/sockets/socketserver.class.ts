import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { Op } from 'sequelize';
import WebSocket, { Server } from 'ws';
import sequelize from '../../database/index.js';
import { primaryKeyOf } from '../../helpers.js';
import User from './events/connect.js';
import Parser from './events/parser.js';
import { SequelizeModel } from '../../interfaces.js';
import { SocketData } from './socket_interfaces.js';

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

export class TSSSocketServer {
  readonly _server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  readonly _wss: WebSocket.Server;

  constructor(_models: { [key: string]: SequelizeModel }) {
    this._server = http.createServer();
    this._wss = new WebSocket.Server({
      server: this._server
    });

    wss.on('connection', (ws: WebSocket.WebSocket & { roomId: number }, req) => {
      console.log(`*** USER CONNECTED ***`);

      ws.on('message', async (data) => {
        console.log(`** MESSAGE RECEIVED **`);

        const parsedMsg = JSON.parse(data.toString('utf-8')) as SocketData;
        // console.log(data);
        // const msgtype = parsedMsg.MSGTYPE;
        // const header = parsedMsg.BLOB;
        // const datatype = header.DATATYPE;
        // const msgdata = header.DATA;

        //Client messages are always DATA
        if (parsedMsg.MSGTYPE !== 'DATA') {
          console.log(parsedMsg.BLOB.DATA);
          ws.send(JSON.stringify({ ERR: "MSGTYPE isn't DATA" }));
          return;
        }

        if (parsedMsg.BLOB.DATATYPE == 'CREWMEMBER') {
          const room_id = parsedMsg.BLOB.DATA.room_id;
          const username = parsedMsg.BLOB.DATA.username;
          const client_id = parsedMsg.BLOB.DATA.client_id;

          const user = new User(username, client_id, room_id);
          if (user) {
            // Register the user in the database and assign them to room
            duplicate = await user.registerUser(parsedMsg.BLOB.DATA, _models);
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

        if (parsedMsg.BLOB.DATATYPE == 'IMU') {
          console.log(parsedMsg.BLOB.DATA);
          parser.parseMessageIMU(parsedMsg.BLOB.DATA, _models);
        }

        if (parsedMsg.BLOB.DATATYPE == 'GPS') {
          console.log(parsedMsg.BLOB.DATA);
          parser.parseMessageGPS(parsedMsg.BLOB.DATA, _models);
        }
      });

      //setInterval(async function() {
      async function sendData(): Promise<void> {
        try {
          const room_id = ws.roomId;
          const sim_state_res = await _models.simulationState.findOne({
            where: { [primaryKeyOf(_models.simulationState)]: room_id },
          });
          const sim_state = sim_state_res?.get({ plain: true });
          //let gps_val  = await models.gpsMsg.findAll({ where: { room_id: room_id }});
          //let imu_val  = await models.imuMsg.findAll({ where: { room_id: room_id }});
          const telem_val = await _models.simulationState.findAll({
            where: { [primaryKeyOf(_models.simulationState)]: room_id },
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
          const room: any = await _models.room.findOne({ where: { [primaryKeyOf(_models.room)]: ws.roomId } });
          room.client_id = null;
          await room.save();
          console.log(`Client removed from room ${room.name}`);
        }
        // close the connection
        ws.terminate();
      });
    });
  }
}

function unassignAllRooms(): void {
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