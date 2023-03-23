import Database from '../../Database.class.js';
import { ILiveModels } from '../../models';

function applyExtraSetup(sequelize: Database<ILiveModels>): void {
  const models: ILiveModels = sequelize.getModels() as ILiveModels;

  const { user, gpsMsg, imuMsg, visionKit } = models;
  //user.belongsTo(room);
  visionKit.belongsTo(user);
  gpsMsg.belongsTo(visionKit);
  imuMsg.belongsTo(visionKit);

  user.hasOne(visionKit);
  visionKit.hasOne(gpsMsg);
  visionKit.hasOne(visionKit);
}

export default applyExtraSetup;
