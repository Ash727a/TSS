import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { Op } from 'sequelize';
import WebSocket from 'ws';
import sequelize from '../../database/index.js';
import { IAllModels } from '../../database/models/index.js';
import { primaryKeyOf } from '../../helpers.js';
import Parser from './events/parser.js';
import handleSocketConnection from './socketConnectionHandler.js';

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
const duplicate = false;
export class TSSWebSocketServer {
  readonly _server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  readonly _wss: WebSocket.Server;

  constructor(_models: IAllModels, socket_port: string) {
    this._server = http.createServer();
    this._wss = new WebSocket.Server({
      server: this._server,
    });

    this._wss.on('connection', (ws: WebSocket.WebSocket, req) => {
      console.log(`*** USER CONNECTED ***`);

      let session_room_id: number;

      handleSocketConnection(ws, _models);

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

    server.listen(socket_port, () => {
      console.log(`SUITS Socket Server listening on: ${SOCKET_PORT}`);
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
