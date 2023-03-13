import { Model } from 'sequelize';

import ModelRoute from './ModelRoute.class.js';

class room extends ModelRoute {
  constructor(_model: any) {
    super(_model);
  }

  async getRoomByStationName(
    req: { params: { station_name: any } },
    res: {
      status: (arg0: number) => {
        (): any;
        (): any;
        json: { (arg0: Model<any, any>[]): void; (): any };
        send: { (arg0: string): void; (): any };
      };
    }
  ): Promise<void> {
    const station_name = req.params.station_name;
    const room = await this.model.findAll({ where: { station_name: station_name } });
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).send('404 - Not found');
    }
  }
}

export default room;
