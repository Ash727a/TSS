import { Model, ModelCtor } from 'sequelize-typescript';

export type SequelizeModel = ModelCtor<Model<any, any>>;

// export type APIResult = {
//   ok: boolean;
//   err: string;
//   data: any;
// };

export interface APIResult {
  OK: {
    ok: true;
    data: any;
  };
  ERROR: {
    ok: false;
    error: string;
  };
}
