import { IAllModels } from '../../../database/models/index.js';
import { IMUData } from '../../../database/models/teams/visionKitData/imuMsg.model.js';
import { primaryKeyOf } from '../../../helpers.js';
import { IMUMsg, SocketMsg, SpecMsg } from '../socketInterfaces.js';
import { isValidRockId, spec_data_map } from './mappings/spec_data.map.js';
import User from './user.class.js';

class Parser {
  // constructor() {}

  async parseMessageIMU(messageObject: any, models: { [x: string]: any; imuMsg?: any }): Promise<void> {
    const imuMsg = await models.imuMsg;

    try {
      const existing_imu = await imuMsg.findOne({ where: { [primaryKeyOf(imuMsg)]: messageObject.guid } });
      if (!existing_imu) {
        imuMsg.create(messageObject);
      } else {
        imuMsg.update(messageObject, {
          where: { [primaryKeyOf(imuMsg)]: messageObject.guid },
        });
      }
      return imuMsg;
    } catch (e) {
      console.log(e);
    }
  }

  async parseMessageGPS(messageObject: any, models: { [x: string]: any; gpsMsg?: any }): Promise<void> {
    const gpsMsg = await models.gpsMsg;

    try {
      const existing_gps = await gpsMsg.findOne({ where: { [primaryKeyOf(gpsMsg)]: messageObject.guid } });
      if (!existing_gps) {
        console.log('GPS RECORD CREATED');
        gpsMsg.create(messageObject);
      } else {
        gpsMsg.update(messageObject, {
          where: { [primaryKeyOf(gpsMsg)]: messageObject.guid },
        });
      }
      return gpsMsg;
    } catch (e) {
      console.log(e);
    }
  }

  async handleSpecData(spec_msg: SpecMsg, _model: Pick<IAllModels, 'geo' | 'room'>): Promise<void> {
    // 1. Map rfid ID -> spec data (either through db or just an object)
    const tag_id = spec_msg.BLOB.DATA.TAG_ID;
    if (!isValidRockId(tag_id)) {
      console.log(`"${tag_id}" is not a valid rfid tag`);
      return;
    }

    const room_in_geo = await _model.room.findOne({ where: { station_name: 'GEO' } });
    if (room_in_geo == null) {
      console.log('No room is in the geology task');
      return;
    }

    // 2. Add scan to record for the room currently in GEO
    _model.geo.update(
      {
        rock_tag_id: tag_id,
        rock_data: JSON.stringify(spec_data_map[tag_id]),
      },
      {
        where: {
          room_id: room_in_geo.id,
        },
      }
    );

    console.log(
      `Recording: ${{
        rock_tag_id: tag_id,
        rock_data: JSON.stringify(spec_data_map[tag_id]),
      }} under room ${room_in_geo.name}`
    );

    // TODO: Log tag_id and scan_time to logs db
  }

  // parseMessageCrewmember(msg: SocketMsg<CrewmemberMsgBlob>): void {
  //   const room_id = msg.BLOB.DATA.room_id;
  //   const username = msg.BLOB.DATA.username;
  //   const client_id = msg.BLOB.DATA.client_id;

  //   const user = new User(username, client_id, room_id);
  //   if (user) {
  //     // Register the user in the database and assign them to room
  //     duplicate = await user.registerUser(msg.BLOB.DATA, _models);
  //   }

  //   // Add the client to the room
  //   if (!duplicate) {
  //     ws.roomId = room_id;
  //     setInterval(() => sendData(), HMD_UPDATE_INTERVAL);
  //   } else {
  //     ws.send('Connection failed, duplicate sign on attempt.');
  //     ws.close(1008, 'Duplicate user');
  //     console.log(`Connection Failed: Duplicate User.`);
  //   }
  // }
}

export default Parser;
