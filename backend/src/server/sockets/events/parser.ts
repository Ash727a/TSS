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

  async parseMessageIMU(obj: { [x: string]: any }, models: { [x: string]: any; imumsg?: any }): Promise<void> {
    const imumsg = await models.imumsg;

    for (const elem in obj)
      if (elem === 'id') delete obj[elem];
      else obj[elem] = parseFloat(obj[elem]);

    try {
      if ((await models.imumsg.count()) === 0) {
        imumsg.create(obj);
      } else {
        imumsg.update(obj, {
          where: { id: 1 },
        });
      }
      return imumsg;
    } catch (e) {
      console.log(e);
    }
  }

  async parseMessageGPS(obj: { [x: string]: any }, models: { [x: string]: any; gpsmsg?: any }): Promise<void> {
    const gpsmsg = await models.gpsmsg;

    for (const elem in obj)
      if (elem === 'class') delete obj[elem];
      else obj[elem] = parseFloat(obj[elem]);

    try {
      if ((await models.gpsmsg.count()) == 0) {
        console.log('GPS TABLE CREATED');
        gpsmsg.create(obj);
      } else {
        gpsmsg.update(obj, {
          where: { id: 1 },
        });
      }
      return gpsmsg;
    } catch (e) {
      console.log(e);
    }
  }
}

export default Parser;
