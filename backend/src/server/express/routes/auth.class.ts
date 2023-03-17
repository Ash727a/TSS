import { Optional } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import { APIResult, SequelizeModel } from '../../../interfaces.js';
import Route from './Route.class.js';

/** CLASS: auth
 * @description: This class is responsible for handling all authentication endpoints.
 * @extends Route
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

  public async registerUser(
    req: { body: Optional<any, string> | undefined },
    res: { status: (arg0: number) => { (): any; (): any; json: { (arg0: any): void; (): any } } }
  ): Promise<any> {
    //Debug console.log(req.body);

    //////////// User Checks

    if (req?.body?.username === undefined || req.body.username === '') {
      res.status(400).json({ ok: false, err: 'Username is missing or empty' });
      return;
    }

    let users;
    try {
      users = await this.getUsers();
    } catch (err) {
      console.log(err);
      res.status(400).json({ ok: false, err: 'Could not get Users' });
      return;
    }

    for (const userRecord of users) {
      if (req.body.username === userRecord.username) {
        res.status(400).json({ ok: false, err: 'User already exists' });
        return;
      }
    }

    //////////// Room Checks

    //TODO check if room is full
    if (req.body.room === undefined || req.body.room > 24) {
      res.status(400).json({ ok: false, err: 'Room ID is missing or out of range' });
      return;
    }

    //////////// VK Assignment

    let vks;
    try {
      vks = await this.getVKs();
    } catch (err) {
      console.log(err);
      res.status(400).json({ ok: false, err: 'Could not get VKs' });
      return;
    }

    const unassigned_vks = this.getUnassignedVKs(vks);
    let next_vk;

    if (unassigned_vks.length === 0) {
      res.status(400).json({ ok: false, err: 'No more VKs to assign' });
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
      res.status(400).json({ ok: false, err: 'Could not get HMDs' });
      return;
    }

    const unassigned_hmds = this.getUnassignedVKs(hmds);
    let next_hmd;

    if (unassigned_hmds.length === 0) {
      res.status(400).json({ ok: false, err: 'No more HMDs to assign' });
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

  public async assignmentLookup(
    req: { body: { hmd: undefined; vk: undefined } },
    res: {
      status: (arg0: number) => {
        (): any;
        (): any;
        json: { (arg0: { ok: boolean; err?: string; data?: any }): void; (): any };
      };
    }
  ): Promise<any> {
    if (req.body.hmd === undefined || req.body.vk === undefined) {
      const _result: APIResult['ERROR'] = { ok: false, error: 'HMD or VK not specified' };
      res.status(400).json(_result);
      return;
    }

    if (req.body.hmd) {
      let hmds;
      try {
        hmds = await this.getHMDs();
      } catch (err) {
        console.log(err);
        const _result: APIResult['ERROR'] = { ok: false, error: 'Could not get HMDs' };
        res.status(400).json(_result);
        return;
      }

      for (const hmdrecord of hmds) {
        if (req.body.hmd === hmdrecord.name) {
          const _result: APIResult['OK'] = { ok: true, data: hmdrecord };
          res.status(200).json(_result);
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
        const _result: APIResult['ERROR'] = { ok: false, error: 'Could not get VKs' };
        res.status(400).json(_result);
        return;
      }

      for (const vkrecord of vks) {
        if (req.body.vk === vkrecord.name) {
          const _result: APIResult['OK'] = { ok: true, data: vkrecord };
          res.status(200).json(_result);
          return;
        }
      }
    }

    const _result: APIResult['ERROR'] = { ok: false, error: 'VK or HMD not found' };
    res.status(400).json(_result);
    return;
  }

  public async assignmentRelease(
    req: { body: { hmd: undefined; vk: undefined; secret: string } },
    res: {
      status: (arg0: number) => {
        (): any;
        (): any;
        json: { (arg0: { ok: boolean; err?: string; data?: any }): void; (): any };
      };
    }
  ): Promise<any> {
    if (req.body.hmd === undefined && req.body.vk === undefined) {
      const _result: APIResult['ERROR'] = { ok: false, error: 'HMD or VK not specified' };
      res.status(400).json(_result);
      return;
    }

    if (req.body.secret !== auth.SECRET_KEY) {
      const _result: APIResult['ERROR'] = { ok: false, error: 'Unauthorized' };
      res.status(400).json(_result);
      return;
    }

    if (req.body.hmd) {
      let hmds;
      try {
        hmds = await this.getHMDs();
      } catch (err) {
        console.log(err);
        const _result: APIResult['ERROR'] = { ok: false, error: 'Could not get HMDs' };
        res.status(400).json(_result);
        return;
      }

      for (const hmdrecord of hmds) {
        let users;
        try {
          users = await this.getUsers();
        } catch (err) {
          console.log(err);
          const _result: APIResult['ERROR'] = { ok: false, error: 'Could not get Users' };
          res.status(400).json(_result);
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
          const _result: APIResult['OK'] = { ok: true, data: hmdrecord };
          res.status(200).json(_result);
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
        const _result: APIResult['ERROR'] = { ok: false, error: 'Could not get VKs' };
        res.status(400).json(_result);
        return;
      }

      for (const vkrecord of vks) {
        if (req.body.vk === vkrecord.name) {
          let users;
          try {
            users = await this.getUsers();
          } catch (err) {
            console.log(err);
            const _result: APIResult['ERROR'] = { ok: false, error: 'Could not get Users' };
            res.status(400).json(_result);
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

          const _result: APIResult['OK'] = { ok: true, data: vkrecord };
          res.status(200).json(_result);
          return;
        }
      }
      return;
    }
    const _result: APIResult['ERROR'] = { ok: false, error: 'VK or HMD not found' };
    res.status(400).json(_result);
    return;
  }

  public async findUser(
    req: { body: { username: string | undefined; guid: string | undefined } },
    res: {
      status: (arg0: number) => {
        (): any;
        (): any;
        json: { (arg0: { ok: boolean; err?: string; user?: any }): void; (): any };
      };
    }
  ): Promise<any> {
    if (
      (req.body.username === undefined || req.body.username === '') &&
      (req.body.guid === undefined || req.body.guid === '')
    ) {
      const _result: APIResult['ERROR'] = { ok: false, error: 'Username or guid is missing or empty' };
      res.status(400).json(_result);
      return;
    }

    let users;
    try {
      users = await this.getUsers();
    } catch (err) {
      console.log(err);
      const _result: APIResult['ERROR'] = { ok: false, error: 'Could not get Users' };
      res.status(400).json(_result);
      return;
    }

    for (const userRecord of users) {
      if (req.body.guid === userRecord.guid) {
        const _result: APIResult['OK'] = { ok: true, data: userRecord };
        res.status(200).json(_result);
        return;
      }

      if (req.body.username === userRecord.username) {
        const _result: APIResult['OK'] = { ok: true, data: userRecord };
        res.status(200).json(_result);
        return;
      }
    }

    const _result: APIResult['ERROR'] = { ok: false, error: 'Could not find User' };
    res.status(400).json(_result);
  }
}

export default auth;
