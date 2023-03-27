import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { Op } from 'sequelize';
import WebSocket from 'ws';
import sequelize from '../../database/index.js';
import { IAllModels } from '../../database/models/index.js';
import { primaryKeyOf } from '../../helpers.js';
import Parser from './events/parser.js';
import User from './events/user.class.js';
import { CrewmemberMsgBlob, GPSMsgBlob, IMUMsgBlob, MsgBlob, SocketMsg } from './socketInterfaces.js';

const models = sequelize.models;

const envPath = path.join(__dirname, '../', '.env');
dotenv.config({ path: envPath });

const SOCKET_PORT = process.env.SOCKET_PORT;
const API_URL = `${process.env.API_URL as string}:${process.env.API_PORT as number | undefined}`;
const server = http.createServer();
// const wss = new WebSocket.Server({ server });
const STOP_SIM_URL = `${API_URL}/api/simulationControl/sim/`;
const HMD_UPDATE_INTERVAL = 2000; //Milliseconds

const parser = new Parser();
let duplicate = false;
export class TSSWebSocketServer {
  readonly _server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  readonly _wss: WebSocket.Server;

  constructor(_models: IAllModels) {
    this._server = http.createServer();
    this._wss = new WebSocket.Server({
      server: this._server,
    });

    this._wss.on('connection', (ws: WebSocket.WebSocket, req) => {
      console.log(`*** USER CONNECTED ***`);

      let session_room_id: number;

      ws.on('message', async (data) => {
        console.log(`** MESSAGE RECEIVED **`);

        const parsedMsg = JSON.parse(data.toString('utf-8')) as SocketMsg<MsgBlob>;
        // console.log(data);
        // const msgtype = parsedMsg.MSGTYPE;
        // const header = parsedMsg.BLOB;
        // const datatype = header.DATATYPE;
        // const msgdata = header.DATA;

        //Client messages are always DATA
        if (parsedMsg.MSGTYPE !== 'DATA') {
          console.log(`MSGTYPE !== 'DATA' in:\n${parsedMsg}`);
          ws.send(JSON.stringify({ ERR: "MSGTYPE isn't DATA" }));
          return;
        }

        if (parsedMsg.BLOB.DATATYPE == 'CREWMEMBER') {
          const crewMemberMsg = parsedMsg as SocketMsg<CrewmemberMsgBlob>;
          const room_id = crewMemberMsg.BLOB.DATA.room_id;
          const username = crewMemberMsg.BLOB.DATA.username;
          const guid = crewMemberMsg.BLOB.DATA.guid;

          const user = new User(username, guid, room_id);
          if (user) {
            // Register the user in the database and assign them to room
            duplicate = await user.registerUser(crewMemberMsg.BLOB.DATA, _models);
          }

          // Add the client to the room
          if (!duplicate) {
            session_room_id = room_id;
            setInterval(() => sendData(), HMD_UPDATE_INTERVAL);
          } else {
            ws.send('Connection failed, duplicate sign on attempt.');
            ws.close(1008, 'Duplicate user');
            console.log(`Connection Failed: Duplicate User.`);
          }
        }

        if (parsedMsg.BLOB.DATATYPE == 'IMU') {
          const imuMsg = parsedMsg as SocketMsg<IMUMsgBlob>;
          console.log(imuMsg.BLOB.DATA);
          parser.parseMessageIMU(imuMsg.BLOB.DATA, _models);
        }

        if (parsedMsg.BLOB.DATATYPE == 'GPS') {
          const gpsMsg = parsedMsg as SocketMsg<GPSMsgBlob>;

          console.log(gpsMsg.BLOB.DATA);
          parser.parseMessageGPS(gpsMsg.BLOB.DATA, _models);
        }
      });

      //setInterval(async function() {
      async function sendData(): Promise<void> {
        try {
          const room_id = session_room_id;
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
        if (session_room_id) {
          // stop sim s
          http.get(STOP_SIM_URL + `${session_room_id}/stop`);
          // remove the client from the assigned room
          const room: any = await _models.room.findOne({ where: { [primaryKeyOf(_models.room)]: session_room_id } });
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
