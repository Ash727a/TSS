import hmd from './hmd.model.js';
import user from './user.model.js';
import * as visionKitData from './visionKitData/index.js';

export default {
  hmd,
  user,
  ...visionKitData.default,
};
