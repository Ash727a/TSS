import { Model } from 'sequelize';

import Route from './Route.class.js';

class room extends Route {
  constructor(_model: any) {
    super(_model);
  }

  async getRoomByStationName(
    req: { params: { station_name: any } },
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        json: { (arg0: Model<any, any>[]): void; new (): any };
        send: { (arg0: string): void; new (): any };
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
