import { IAllModels, ILiveModels } from '../../../database/models/index.js';
import { GpsAttributes } from '../../../database/models/teams/visionKitData/gpsMsg.model.js';
import { GpsMsg, IMUMsg, RoverMsg, SpecMsg } from '../socketInterfaces.js';
import { isValidRockId, spec_data_map } from './mappings/spec_data.map.js';
import { IMUAttributes } from '../../../database/models/teams/visionKitData/imuMsg.model.js';
import { GPS_SEMAPHORE } from '../enums/socket.enum.js';

class Parser {
  // constructor() {}

  async parseMessageIMU(messageObject: IMUMsg, models: Pick<ILiveModels, 'imuMsg' | 'user'>): Promise<void> {
    const msgData = messageObject.BLOB.DATA;
    delete (messageObject as any).id;
    const user_guid = messageObject.MACADDRESS;

    const matching_user = models.user.findOne({
      where: {
        user_guid: user_guid,
      },
    });

    if (!matching_user) {
      console.log(`No user found with guid: ${user_guid}. Dropping imu message`);
      return;
    }

    const newImuRecord: Pick<IMUAttributes, 'user_guid'> & Partial<IMUAttributes> = {
      user_guid: user_guid,
      ...msgData,
    };

    try {
      const existing_imu = await models.imuMsg.findOne({
        where: { user_guid: user_guid },
      });

      if (!existing_imu) {
        // console.log('creating');
        // models.imuMsg.create(newImuRecord as any);
        models.imuMsg.create(newImuRecord as IMUAttributes);
      } else {
        // console.log('updating');
        models.imuMsg.update(newImuRecord, {
          where: { user_guid: user_guid },
        });
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

    delete msgData.device;
    delete msgData.class;

    if (msgData.lat === 0 && msgData.lon === 0) {
      Object.assign(msgData, { fix_status: GPS_SEMAPHORE.NOFIX });
    } else {
      Object.assign(msgData, { fix_status: GPS_SEMAPHORE.FIX });
    }

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
    // console.log(`TAG ID:\n${tag_id}\n`);
    if (!isValidRockId(tag_id)) {
      console.log(`"${tag_id}" is not a valid RFID tag`);
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

  async handleRoverData(rover_msg: RoverMsg, _model: Pick<IAllModels, 'rover' | 'room'>): Promise<void> {
    // 1. Map rfid ID -> spec data (either through db or just an object)

    const room_in_rover = await _model.room.findOne({ where: { station_name: 'ROV' } });
    if (room_in_rover == null) {
      console.log('No room assigned rover task');
      return;
    }

    _model.rover.update(rover_msg.BLOB.DATA, { where: { room_id: room_in_rover.id } });
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
