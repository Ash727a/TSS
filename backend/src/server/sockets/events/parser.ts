import { where } from 'sequelize';
import { IAllModels, ILiveModels } from '../../../database/models/index.js';
import { GpsAttributes } from '../../../database/models/teams/visionKitData/gpsMsg.model.js';
import { primaryKeyOf } from '../../../helpers.js';
import { GpsMsg, SpecMsg } from '../socketInterfaces.js';
import { isValidRockId, spec_data_map } from './mappings/spec_data.map.js';
import * as util from 'node:util';
import { IMUAttributes } from '../../../database/models/teams/visionKitData/imuMsg.model.js';

class Parser {
  // constructor() {}

  async parseMessageIMU(messageObject: any, models: Pick<ILiveModels, 'imuMsg' | 'user'>): Promise<void> {

    const msgData = messageObject.BLOB.DATA;
    delete messageObject.id;

    const matching_user = models.user.findOne({
      where: {
        user_guid: msgData.MACADDRESS,
      },
    });

    if (!matching_user) {
      console.log(`No user found with guid: ${msgData.MACADDRESS}. Dropping imu message`);
      return;
    }

    const newImuRecord: Pick<IMUAttributes, 'user_guid'> & Partial<IMUAttributes> = {
      user_guid: messageObject.MACADDRESS,
      ...msgData,
    };

    try {
      const existing_imu = await models.imuMsg.findOne({ where: { user_guid: "fdbee7e5-9887-495e-aabb-f10d1386a7e9" }});

      if (!existing_imu) {
        console.log('creatin');
        // models.imuMsg.create(newImuRecord as any);
        models.imuMsg.create(newImuRecord as IMUAttributes);

      } else {
        console.log('updating');
        // models.imuMsg.update(newImuRecord, {
        //   where: { user_guid: "fdbee7e5-9887-495e-aabb-f10d1386a7e9" },
        // });
      }
      return;
    } catch (e) {
      console.log(e);
    }
  }

  // static setMissingToNull(obj: { [key: string]: any }): typeof obj {
  //   for (const key of Object.keys(obj)) {
  //     obj[key] = obj[key] || null;
  //   }

  //   return obj;
  // }

  static setMissingToNull(obj: { [key: string]: any }): void {
    for (const key of Object.keys(obj)) {
      obj[key] = obj[key] || null;
    }
  }

  async parseMessageGPS(msgObj: GpsMsg, models: Pick<ILiveModels, 'gpsMsg' | 'user'>): Promise<void> {
    const gpsMsg = await models.gpsMsg;
    const msgData = msgObj.BLOB.DATA;

    // These are sent by the vision kit but not used later

    Parser.setMissingToNull(msgData);

    delete msgObj.BLOB.DATA.device;

    const newGpsRecord: Pick<GpsAttributes, 'user_guid' | 'mode'> & Partial<GpsAttributes> = {
      user_guid: msgObj.MACADDRESS,
      ...msgData,
    };

    if (newGpsRecord.user_guid == undefined) {
      console.log(`GPS message's user_guid missing, discarding message`); // Should not happen
      return;
    }

    // TEMPORARY WORKAROUND - DROPS MESSAGES IF NO USER RECORD HAS MATCHING GUID
    const matching_user = models.user.findOne({
      where: {
        user_guid: msgObj.MACADDRESS,
      },
    });

    if (!matching_user) {
      console.log(`No user found with guid: ${msgObj.MACADDRESS}. Dropping message`);
      return;
    }

    try {
      const existing_gps = await gpsMsg.findOne({ where: { user_guid: newGpsRecord.user_guid } });
      if (!existing_gps) {
        console.log('GPS RECORD CREATED');
        gpsMsg.create(newGpsRecord);
      } else {
        await gpsMsg.update(newGpsRecord, {
          where: { user_guid: newGpsRecord.user_guid },
        });
      }
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
    _model.geo.upsert({
      room_id: room_in_geo.id,
      rock_tag_id: tag_id,
      rock_data: JSON.stringify(spec_data_map[tag_id]),
    });

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
