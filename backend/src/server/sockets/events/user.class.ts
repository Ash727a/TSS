import { liveModels } from '../../../database/models/index.js';
import { primaryKeyOf } from '../../../helpers.js';
import { CrewmemberMsgBlob } from '../socketInterfaces.js';
// import { ISocketServerModels } from '../model_interfaces.js';

class User {
  uRoomId: number;
  uUsername: string;
  uClientId: string;
  constructor(username: string, client_id: string, room_id: number) {
    this.uRoomId = room_id;
    this.uUsername = username;
    this.uClientId = client_id;
  }

  async registerUser(
    registration_data: CrewmemberMsgBlob['DATA'],
    models: Pick<typeof liveModels, 'user' | 'room'>
  ): Promise<boolean> {
    const user = await models.user;
    const room = await models.room;

    try {
      const existingUser = await user.findOne({ where: { [primaryKeyOf(user)]: this.uClientId } });
      const assigned_room = await room.findOne({ where: { [primaryKeyOf(room)]: this.uRoomId, client_id: null } });
      //check if user is already registered
      if (!existingUser) {
        console.log(registration_data);
        await user.create(registration_data); //register the new user
        console.log(`${this.uUsername} successfully registered.`);
      } else console.log(`${this.uUsername} is already registered.`);

      //check if assigned room is vacant
      if (assigned_room) {
        await room.update({ client_id: this.uClientId }, { where: { [primaryKeyOf(room)]: this.uRoomId } }); //assign the client_id to the room
        await assigned_room.save();
        console.log(`${this.uUsername} assigned to room ${this.uRoomId}.`);
        return false;
      } else {
        console.log(`This room is not available.`); //this shouldn't happen
        return true;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export default User;
