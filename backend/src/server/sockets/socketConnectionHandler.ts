import { WebSocket } from 'ws';

import Parser from './events/parser.js';
import User from './events/user.class.js';

import type { IAllModels } from '../../database/models/index.js';

import type { CrewmemberMsg, GpsMsg, IMUMsg, SpecMsg, RoverMsg, UnknownMsg } from './socketInterfaces.js';
import { DATATYPE } from './enums/socket.enum.js';
import visionKitMap from './vision-kit.map.js';

export default function handleSocketConnection(ws: WebSocket, models: IAllModels, hmd_update_interval: number): void {
  const parser = new Parser();
  let current_user: User | null;
  ws.on('message', async (data, req) => {
    console.log(`** MESSAGE RECEIVED **`);
    const parsedMsg = JSON.parse(data.toString('utf-8')) as UnknownMsg;

    const msg: any = parsedMsg as any;
    if (msg.rover && checkFields(msg.rover, ['cmd', 'goal_lat', 'goal_lon'])) {
      // console.log('ROVER COMMAND RECEIVED', msg.rover);
      if (msg.rover.cmd === 'navigate') {
        if (current_user) {
          const payload = {
            ...msg.rover,
            navigation_status: 'NAVIGATING',
          };
          current_user.updateRovCmd(payload);
        } else {
          console.log('User not registered');
        }
      } else if (msg.rover.cmd === 'recall') {
        if (current_user) {
          // current_user.recall();
        } else {
          console.log('User not registered');
        }
      } else {
        console.log(`Invalid rover command: '${msg.rover.cmd}'`);
      }
      return;
    }

    //Client messages are always DATA
    if (parsedMsg.MSGTYPE !== 'DATA') {
      console.log(`MSGTYPE !== 'DATA' in:\n${parsedMsg}`);
      ws.send(JSON.stringify({ ERR: "MSGTYPE isn't DATA" }));
      return;
    }

    switch (parsedMsg.BLOB.DATATYPE) {
      case DATATYPE.HMD: {
        const crewMemberMsg = parsedMsg as CrewmemberMsg;

        if (!(crewMemberMsg.BLOB.DATA.user_guid in visionKitMap)) {
          console.log(`Crewmember provided invalid user_guid: ${crewMemberMsg.BLOB.DATA.user_guid}`);
          ws.close(1008, `Invalid user_guid. Please ensure user_guid matches visionkit's guid`);
          break;
        }
        const user = await User.build(crewMemberMsg.BLOB.DATA, models, ws, hmd_update_interval);
        current_user = user;
        if (user == null) {
          ws.close(1008, 'Failed to register user');
          console.log('Failed to register user');
        }
        break;
      }

      case DATATYPE.IMU: {
        const imuMsg = parsedMsg as unknown as IMUMsg;
        if (!(imuMsg.MACADDRESS in visionKitMap)) {
          console.log(`Following guid from visionkit is invalid: ${imuMsg.MACADDRESS}`);
          ws.close(1008, `Invalid visionkit guid. Please ensure the vkid in the visionkit's .env is correct`);
          break;
        }
        parser.parseMessageIMU(imuMsg, models);
        break;
      }
      case DATATYPE.GPS: {
        const gpsMsg = parsedMsg as GpsMsg;
        if (!(gpsMsg.MACADDRESS in visionKitMap)) {
          console.log(`Following guid from visionkit is invalid: ${gpsMsg.MACADDRESS}`);
          ws.close(1008, `Invalid visionkit guid. Please ensure the vkid in the visionkit's .env is correct`);
          break;
        }
        parser.parseMessageGPS(gpsMsg, models);
        break;
      }
      case DATATYPE.SPEC: {
        const specMsg = parsedMsg as SpecMsg;
        await parser.handleSpecData(specMsg, models);
        break;
      }
      case DATATYPE.ROV: {
        const roverMsg = parsedMsg as RoverMsg;

        await parser.handleRoverData(roverMsg, models);
        break;
      }

      default: {
        console.log(`Invalid parsedMsg.BLOB.DATATYPE: ${parsedMsg.BLOB.DATATYPE}`);
        ws.close(1008, `Invalid parsedMsg.BLOB.DATATYPE: ${parsedMsg.BLOB.DATATYPE}`);
        break;
      }
    }
  });
}

function checkFields(object: any, attributes: string[]): boolean {
  for (const attribute of attributes) {
    // eslint-disable-next-line no-prototype-builtins
    if (!object.hasOwnProperty(attribute)) {
      return false;
    }
  }
  return true;
}
