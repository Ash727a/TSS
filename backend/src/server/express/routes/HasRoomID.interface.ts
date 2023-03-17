import { APIRequest, APIResult } from '../../../interfaces.js';

/** INTERFACE: HasRoomID
 * @description This interface is a generic interface for all routes that have a room_id column.
 * @function getByRoomId - GET MULTIPLE by room id /api/{model's name}/room/:room
 * @returns {HasRoomID} - The HasRoomID interface.
 */
interface HasRoomID {
  /**
   * GET MULTIPLE by room id /api/{model's name}/room/:room
   * @param {APIRequest} req
   * @param {APIResult} res
   * @returns {any[]}
   * @throws 404 - Not found
   */
  getByRoomID(req: APIRequest, res: APIResult): Promise<void>;
}

export default HasRoomID;
