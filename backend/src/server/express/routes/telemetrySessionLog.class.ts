import { Model } from 'sequelize';

import HasRoomID from './HasRoomID.interface.js';
import ModelRoute from './ModelRoute.class.js';
import * as shared from './shared.js';

class telemetrySessionLog extends ModelRoute implements HasRoomID {
  constructor(_model: any) {
    super(_model);
  }

  /* See shared.ts for getByRoomId function definition */
  async getByRoomID(req: any, res: any): Promise<void> {
    return await shared.getByRoomID(this.model, req, res);
  }
}

export default telemetrySessionLog;
