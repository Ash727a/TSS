import { Model } from 'sequelize';

import Route from './ModelRoute.class.js';

class users extends Route {
  constructor(_model: any) {
    super(_model);
  }

  async getByRoomId(
    req: { params: { room: any } },
    res: {
      status: (arg0: number) => {
        (): any;
        (): any;
        json: { (arg0: Model<any, any>[]): void; (): any };
        send: { (arg0: string): void; (): any };
      };
    }
  ): Promise<void> {
    const id = req.params.room;
    const uia = await this.model.findAll({ where: { room_id: id } });
    if (uia) {
      res.status(200).json(uia);
    } else {
      res.status(404).send('404 - Not found');
    }
  }

  async updateUIA(
    req: { body: { [x: string]: boolean } },
    res: { status: (arg0: number) => { (): any; (): any; end: { (): void; (): any } } }
  ): Promise<void> {
    const roomInUIA = await this.model.findOne({
      attributes: ['id'],
      where: {
        station_name: 'UIA',
      },
    });

    if (roomInUIA === null) {
      return;
    }

    const id = roomInUIA.get('id');

    await this.model.update(req.body, {
      where: {
        room: id,
      },
    });

    res.status(200).end();
  }
}

export default users;
