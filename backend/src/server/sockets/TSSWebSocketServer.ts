import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { IAllModels } from '../../database/models/index.js';
import handleSocketConnection from './socketConnectionHandler.js';

const HMD_UPDATE_INTERVAL = 2000; //Milliseconds

export class TSSWebSocketServer {
  private readonly _server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  private readonly _wss: WebSocketServer;

  constructor(_models: IAllModels, socket_port: number) {
    this._server = http.createServer();
    this._wss = new WebSocketServer({ server: this._server });

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

// function unassignAllRooms(): void {
//   try {
//     models.room
//       .update({ client_id: null }, { where: { client_id: { [Op.ne]: null } } })
//       .then(() => {
//         console.log('All rooms unassigned');
//       })
//       .catch((err: any) => {
//         console.error('Error unassigning rooms:', err);
//       });
//   } catch (e) {
//     console.log(e);
//   }
// }

// process.on('SIGINT', () => {
//   console.log('Received SIGINT signal, shutting down server...');
//   unassignAllRooms();
//   server.close(() => {
//     console.log('Server has been gracefully shutdown.');
//     process.exit(0);
//   });
// });
