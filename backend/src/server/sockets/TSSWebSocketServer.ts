import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { IAllModels } from '../../database/models/index.js';
import handleSocketConnection from './socketConnectionHandler.js';
import { RoverSocketServer } from './rover/RoverSocketServer.js';

const HMD_UPDATE_INTERVAL = 2000; //Milliseconds

export class TSSWebSocketServer {
  private readonly _server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  private readonly _wss: WebSocketServer;
  private readonly _rss: RoverSocketServer;

  constructor(_models: IAllModels, socket_port: number) {
    this._server = http.createServer();
    this._wss = new WebSocketServer({ server: this._server });
    this._rss = new RoverSocketServer(_models);

    this._wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
      console.log(`*** USER CONNECTED ***`);
      handleSocketConnection(ws, _models, HMD_UPDATE_INTERVAL);
    });

    this._wss.on('close', () => {
      for (const ws of this._wss.clients) {
        ws.close();
      }
    });

    this._server.listen(socket_port, () => {
      console.log(`SUITS Socket Server listening on: ${socket_port}`);
    });
  }
}
