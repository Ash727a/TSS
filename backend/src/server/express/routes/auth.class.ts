import { v4 as uuidv4 } from 'uuid';

import { APIRequest, APIResult, SequelizeModel } from '../../../interfaces.js';
import Route from './Route.class.js';

/** CLASS: auth
 * @description: This class is responsible for handling all authentication endpoints.
 * @extends Route
 * @param {SequelizeModel} _userModel - The user model.
 * @param {SequelizeModel} _visionKitModel - The vision kit model.
 * @param {SequelizeModel} _hmdModel - The hmd model.
 * @returns {auth} - The auth object.
 */
class auth extends Route {
  userModel: SequelizeModel;
  visionKitModel: SequelizeModel;
  hmdModel: SequelizeModel;
  private static readonly SECRET_KEY = 'admin78$Akt';

  constructor(_userModel: SequelizeModel, _visionKitModel: SequelizeModel, _hmdModel: SequelizeModel) {
    super();
    this.userModel = _userModel;
    this.visionKitModel = _visionKitModel;
    this.hmdModel = _hmdModel;
  }

  // TODO
  // add getUser endpoint by assignment GUID
  private async getUsers(): Promise<any> {
    const userData = await this.userModel.findAll();
    return userData;
  }
  private async getVKs(): Promise<any> {
    const vkData = await this.visionKitModel.findAll();
    return vkData;
  }
  private async getHMDs(): Promise<any> {
    const hmdData = await this.hmdModel.findAll();
    return hmdData;
  }

  private getUnassignedVKs(vks: any): any {
    const unassigned: any[] = [];
    //console.log(vk,vks)
    for (const vk in vks) {
      if (!vks[vk].assignment) unassigned.push(vks[vk]);
    }
    return unassigned;
  }

  public async registerUser(req: APIRequest, res: APIResult): Promise<void> {
    //////////// User Checks
    if (req.body.username === undefined || req.body.username === '') {
      res.status(400).send('Username is missing or empty');
      return;
    }

    let users;
    try {
      users = await this.getUsers();
    } catch (err) {
      console.log(err);
      res.status(400).send('Could not get Users');
      return;
    }

    for (const userRecord of users) {
      if (req.body.username === userRecord.username) {
        res.status(400).send('User already exists');
        return;
      }
    }

    //////////// Room Checks

    //TODO check if room is full
    if (req.body.room === undefined || req.body.room > 24) {
      res.status(400).send('Room ID is missing or out of range');
      return;
    }

    //////////// VK Assignment

    let vks;
    try {
      vks = await this.getVKs();
    } catch (err) {
      console.log(err);
      res.status(400).send('Could not get VKs');
      return;
    }

    const unassigned_vks = this.getUnassignedVKs(vks);
    let next_vk;

    if (unassigned_vks.length === 0) {
      res.status(400).send('No more VKs to assign');
      return;
    } else {
      next_vk = unassigned_vks[0];
      req.body.visionKit = next_vk.name;
    }

    //////////// HMD Assignment

    let hmds;
    try {
      hmds = await this.getHMDs();
    } catch (err) {
      console.log(err);
      res.status(400).send('Could not get HMDs');
      return;
    }

    const unassigned_hmds = this.getUnassignedVKs(hmds);
    let next_hmd;

    if (unassigned_hmds.length === 0) {
      res.status(400).send('No more HMDs to assign');
      return;
    } else {
      next_hmd = unassigned_hmds[0];
      req.body.hmd = next_hmd.name;
    }

    req.body.guid = uuidv4();

    const user = await this.userModel.create(req.body);

    next_vk.assignment = req.body.guid;
    await next_vk.save();

    next_hmd.assignment = req.body.guid;
    await next_hmd.save();

    res.status(200).json(user);
  }

  public async assignmentLookup(req: APIRequest, res: APIResult): Promise<void> {
    if (req.body.hmd === undefined || req.body.vk === undefined) {
      res.status(400).send('HMD or VK not specified');
      return;
    }

    if (req.body.hmd) {
      let hmds;
      try {
        hmds = await this.getHMDs();
      } catch (err) {
        console.log(err);
        res.status(400).send('Could not get HMDs');
        return;
      }

      for (const hmdrecord of hmds) {
        if (req.body.hmd === hmdrecord.name) {
          res.status(200).json(hmdrecord);
          return;
        }
      }
    }

    if (req.body.vk) {
      let vks;
      try {
        vks = await this.getVKs();
      } catch (err) {
        console.log(err);
        res.status(400).send('Could not get VKs');
        return;
      }

      for (const vkrecord of vks) {
        if (req.body.vk === vkrecord.name) {
          res.status(200).json(vkrecord);
          return;
        }
      }
    }

    res.status(400).send('VK or HMD not found');
    return;
  }

  public async assignmentRelease(req: APIRequest, res: APIResult): Promise<void> {
    if (req.body.hmd === undefined && req.body.vk === undefined) {
      res.status(400).send('HMD or VK not specified');
      return;
    }

    if (req.body.secret !== auth.SECRET_KEY) {
      res.status(401).send('Unauthorized');
      return;
    }

    if (req.body.hmd) {
      let hmds;
      try {
        hmds = await this.getHMDs();
      } catch (err) {
        console.log(err);
        res.status(400).send('Could not get HMDs');
        return;
      }

      for (const hmdrecord of hmds) {
        let users;
        try {
          users = await this.getUsers();
        } catch (err) {
          console.log(err);
          res.status(400).send('Could not get Users');
          return;
        }

        for (const userRecord of users) {
          if (hmdrecord.assignment === userRecord.guid) {
            userRecord.hmd = null;
            userRecord.save();
          }
        }

        if (req.body.hmd === hmdrecord.name) {
          hmdrecord.assignment = null;
          await hmdrecord.save();
          res.status(200).json(hmdrecord);
          return;
        }
      }
    }

    if (req.body.vk) {
      let vks;
      try {
        vks = await this.getVKs();
      } catch (err) {
        console.log(err);
        res.status(400).send('Could not get VKs');
        return;
      }

      for (const vkrecord of vks) {
        if (req.body.vk === vkrecord.name) {
          let users;
          try {
            users = await this.getUsers();
          } catch (err) {
            console.log(err);
            res.status(400).send('Could not get Users');
            return;
          }

          for (const userRecord of users) {
            if (vkrecord.assignment === userRecord.guid) {
              userRecord.visionKit = null;
              userRecord.save();
            }
          }

          vkrecord.assignment = null;
          await vkrecord.save();

          res.status(200).json(vkrecord);
          return;
        }
      }
      return;
    }
    res.status(400).send('VK or HMD not found');
    return;
  }

  public async findUser(req: APIRequest, res: APIResult): Promise<void> {
    if (
      (req.body.username === undefined || req.body.username === '') &&
      (req.body.guid === undefined || req.body.guid === '')
    ) {
      res.status(400).send('Username or guid is missing or empty');
      return;
    }

    let users;
    try {
      users = await this.getUsers();
    } catch (err) {
      console.log(err);
      res.status(400).send('Could not get Users');
      return;
    }

    for (const userRecord of users) {
      if (req.body.guid === userRecord.guid) {
        res.status(200).json(userRecord);
        return;
      }

      if (req.body.username === userRecord.username) {
        res.status(200).json(userRecord);
        return;
      }
    }

    res.status(400).send('Could not find User');
  }
}

export default auth;
