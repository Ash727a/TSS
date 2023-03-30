import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { Op } from 'sequelize';
import WebSocket from 'ws';
import sequelize from '../../database/index.js';
import { IAllModels } from '../../database/models/index.js';
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
  private readonly _server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  private readonly _wss: WebSocket.Server;

  constructor(_models: IAllModels, socket_port: number) {
    this._server = http.createServer();
    this._wss = new WebSocket.Server({ server: this._server });

    this._wss.on('connection', (ws: WebSocket.WebSocket, req) => {
      console.log(`*** USER CONNECTED ***`);

      let session_room_id: number;

      handleSocketConnection(ws, _models, HMD_UPDATE_INTERVAL);
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
