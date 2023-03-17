import { Optional } from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';

export type SequelizeModel = ModelCtor<Model<any, any>>;

// export type APIResult = {
//   ok: boolean;
//   err: string;
//   data: any;
// };

// export interface APIResult {
//   OK: {
//     ok: true;
//     data: any;
//   };
//   ERROR: {
//     ok: false;
//     error: string;
//   };
// }

export type APIRequest = { body: Optional<any, string>; params: any };

export type APIResult = {
  status: (code: number) => { send: { (errorString: string): void }; json: { (data: any): void }; end: { (): void } };
};
