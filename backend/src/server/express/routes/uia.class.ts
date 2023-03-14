import { Model } from 'sequelize';

import ModelRoute from './ModelRoute.class.js';

class uia extends ModelRoute {
  constructor(_model: any) {
    super(_model);
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

export default uia;
