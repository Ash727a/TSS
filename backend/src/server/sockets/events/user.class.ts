import { WebSocket } from 'ws';

import { liveModels } from '../../../database/models/index.js';
import { CrewmemberMsg } from '../socketInterfaces.js';

// import { ISocketServerModels } from '../model_interfaces.js';
import type user from '../../../database/models/teams/user.model.js';

type ModelsForUser = Pick<typeof liveModels, 'user' | 'room' | 'simulationState'>;
class User {
  // private room_id: number;
  private readonly username: string;
  private readonly guid: string;
  private _models: ModelsForUser;
  private _ws: WebSocket;
  private mapped_user: user;

  private constructor(
    { username, guid }: CrewmemberMsg['BLOB']['DATA'],
    _models: ModelsForUser,
    mapped_user: user,
    _ws: WebSocket,
    hmd_update_interval: number
  ) {
    this.username = username;
    this.guid = guid;
    this._models = _models;
    this.mapped_user = mapped_user;
    this._ws = _ws;

    setInterval(() => this.sendData(), hmd_update_interval);
  }

  // TODO: CHANGE TO ACTUAL FK, BUT NULLABLE
  // TODO: VALIDATE GUID AND USERNAME - MAYBE JUST USE AN OBJECT AS A MAP
  public static async build(
    { username, guid }: CrewmemberMsg['BLOB']['DATA'],
    _models: ModelsForUser,
    _ws: WebSocket,
    hmd_update_interval: number
  ): Promise<User | null> {
    const user = await _models.user;
    const room = await _models.room;

    try {
      const existing_user = await user.findOne({ where: { user_guid: guid } });

      //check if user is already registered
      if (existing_user) {
        console.log(`${username} is already registered. Cannot create new instance`);
        return null;
      }

      console.log(`Attempting to register new user\nUsername: ${username}\nGuid: ${guid}`);

      // look for an empty room for the user
      const empty_room = await room.findOne({ where: { user_guid: null } });
      if (empty_room === null) {
        console.log(`No empty room found to assign the following user to:\nUsername: ${username}\nGuid: ${guid}`);
        return null;
      }

      // Add new user to DB
      const new_mapped_user = await user.create({
        username: username,
        user_guid: guid,
        room_id: empty_room.id,
      });

      // Update room with user's guid
      await empty_room.update('user_guid', guid); //assign the newly registered user's guid to the room
      empty_room.save();

      console.log(`Created user with: ${JSON.stringify(user)}`);
      console.log(`${guid} assigned to room ${empty_room.name}`);

      return new User({ username, guid }, _models, new_mapped_user, _ws, hmd_update_interval);

      //check if assigned room is vacant
      // if (assigned_room) {
      //   await room.update({ client_id: this.guid }, { where: { [primaryKeyOf(room)]: this.room_id } }); //assign the client_id to the room
      //   await assigned_room.save();
      //   console.log(`${this.username} assigned to room ${this.room_id}.`);
      //   return false;
      // } else {
      //   console.log(`This room is not available.`); //this shouldn't happen
      //   return true;
      // }
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async sendData(): Promise<void> {
    try {
      const sim_state_res = await this._models.simulationState.findOne({
        where: { room_id: this.mapped_user.room_id },
      });

      const sim_state = sim_state_res?.get({ plain: true });
      if (sim_state == undefined) {
        return;
      }
      // let gps_val  = await models.gpsMsg.findAll({ where: { room_id: room_id }});
      // let imu_val  = await models.imuMsg.findAll({ where: { room_id: room_id }});
      // const telem_val = await this._models.simulationState.findAll({
      //   where: { id: this.room_id },
      // });

      const data = {
        //gpsMsg: gps_val,
        //imuMsg: imu_val,
        simulationStates: sim_state,
        /*
          add spectrometer data
          add rover data 
        */
      };

      if (sim_state?.is_running) {
        this._ws.send(JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error:', err);
    }
  }
}

export default User;
