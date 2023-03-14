import { Model } from 'sequelize';

/** INTERFACE: HasRoomID
 * @description This interface is a generic interface for all routes that have a room_id column.
 * @function getByRoomId - GET MULTIPLE by room id /api/{model's name}/room/:room
 * @returns {HasRoomID} - The HasRoomID interface.
 */
interface HasRoomID {
  /**
   * GET MULTIPLE by room id /api/{model's name}/room/:room
   * @param {*} req
   * @param {*} res
   * @returns {any[]}
   * @throws 404 - Not found
   */
  getByRoomID(
    req: { params: { room: any } },
    res: {
      status: (arg0: number) => {
        (): any;
        (): any;
        json: { (arg0: Model<any>[]): void; (): any };
        send: { (arg0: string): void; (): any };
      };
    }
  ): Promise<void>;
}

export default HasRoomID;
