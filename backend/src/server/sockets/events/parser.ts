import { Model, ModelCtor } from 'sequelize';

class Parser {
  // constructor() {}

  parseMessage(data: { toString: () => string }, cb: (arg0: null, arg1: any) => void): void {
    const obj = JSON.parse(data.toString());
    console.log(obj);
    // console.log(obj);
    // if( (obj.event !== 'connection' && !obj.id) && !obj.event && !obj.payload) {
    //     console.log(`ERR-PRSVAL`);
    //     return cb(`ERR-PRSVAL`, null);
    // }
    return cb(null, obj);
  }

  async parseMessageIMU(obj: { [x: string]: any }, models: { [x: string]: any; imuMsg?: any }): Promise<void> {
    const imuMsg = await models.imuMsg;

    for (const elem in obj)
      if (elem === 'id') delete obj[elem];
      else obj[elem] = parseFloat(obj[elem]);

    try {
      if ((await models.imuMsg.count()) === 0) {
        imuMsg.create(obj);
      } else {
        imuMsg.update(obj, {
          where: { id: 1 },
        });
      }
      return imuMsg;
    } catch (e) {
      console.log(e);
    }
  }

  async parseMessageGPS(obj: { [x: string]: any }, models: { [x: string]: any; gpsMsg?: any }): Promise<void> {
    const gpsMsg = await models.gpsMsg;

    for (const elem in obj)
      if (elem === 'class') delete obj[elem];
      else obj[elem] = parseFloat(obj[elem]);

    try {
      if ((await models.gpsMsg.count()) == 0) {
        console.log('GPS TABLE CREATED');
        gpsMsg.create(obj);
      } else {
        gpsMsg.update(obj, {
          where: { id: 1 },
        });
      }
      return gpsMsg;
    } catch (e) {
      console.log(e);
    }
  }
}

export default Parser;
