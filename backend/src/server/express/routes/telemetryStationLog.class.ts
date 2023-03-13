import { Model } from 'sequelize';

import ModelRoute from './ModelRoute.class.js';

class telemetryStationLog extends ModelRoute {
  constructor(_model: any) {
    super(_model);
  }

  /**
   * GET MULTIPLE by room id /api/telemetryStationLog/room/:room
   * @param {*} req
   * @param {*} res
   * @returns {TelemetryStationLog[]}
   * @throws 404 - Not found
   */
  async getByRoomId(
    req: { params: { room: any } },
    res: {
      status: (arg0: number) => {
        (): any;
        (): any;
        json: { (arg0: Model<any>[]): void; (): any };
        send: { (arg0: string): void; (): any };
      };
    }
  ): Promise<void> {
    const id = req.params.room;
    const results = await this.model.findAll({ where: { room: id } });
    if (results) {
      res.status(200).json(results);
    } else {
      res.status(404).send('404 - Not found');
    }
  }
}

export default telemetryStationLog;
