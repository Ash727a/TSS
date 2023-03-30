import { WebSocket } from 'ws';

import Parser from './events/parser.js';
import User from './events/user.class.js';

import type { IAllModels } from '../../database/models/index.js';
import type { CrewmemberMsg, GPSMsg, IMUMsg, SpecMsg, UnknownMsg } from './socketInterfaces.js';

export default function handleSocketConnection(_ws: WebSocket, _models: IAllModels, hmd_update_interval: number): void {
  const parser = new Parser();

  _ws.on('message', async (data) => {
    console.log(`** MESSAGE RECEIVED **`);

    const parsedMsg = JSON.parse(data.toString('utf-8')) as UnknownMsg;
    // console.log(data);
    // const msgtype = parsedMsg.MSGTYPE;
    // const header = parsedMsg.BLOB;
    // const datatype = header.DATATYPE;
    // const msgdata = header.DATA;

    //Client messages are always DATA
    if (parsedMsg.MSGTYPE !== 'DATA') {
      console.log(`MSGTYPE !== 'DATA' in:\n${parsedMsg}`);
      _ws.send(JSON.stringify({ ERR: "MSGTYPE isn't DATA" }));
      return;
    }

    switch (parsedMsg.BLOB.DATATYPE) {
      case 'CREWMEMBER': {
        const crewMemberMsg = parsedMsg as CrewmemberMsg;
        const user = await User.build(crewMemberMsg.BLOB.DATA, _models, _ws, hmd_update_interval);

        if (user == null) {
          _ws.close(1008, 'Failed to register user');
          console.log('Failed to register user');
        }
        break;
      }

      case 'IMU': {
        const imuMsg = parsedMsg as IMUMsg;
        console.log(imuMsg.BLOB.DATA);
        parser.parseMessageIMU(imuMsg.BLOB.DATA, _models);
        break;
      }

      case 'GPS': {
        const gpsMsg = parsedMsg as GPSMsg;
        console.log(gpsMsg.BLOB.DATA);
        parser.parseMessageGPS(gpsMsg.BLOB.DATA, _models);
        break;
      }
      case 'SPEC': {
        const specMsg = parsedMsg as SpecMsg;
        console.log(specMsg.BLOB.DATA);
        await parser.handleSpecData(specMsg, _models);
      }
    }
  });
}
