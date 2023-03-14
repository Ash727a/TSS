import { Model } from 'sequelize';

import HasRoomID from './HasRoomID.interface.js';
import ModelRoute from './ModelRoute.class.js';
import * as shared from './shared.js';

class users extends ModelRoute implements HasRoomID {
  constructor(_model: any) {
    super(_model);
  }

  /* See shared.ts for getByRoomId function definition */
  async getByRoomID(
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
    return await shared.getByRoomID(this.model, req, res);
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
