import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { Model } from 'sequelize-typescript';

// Only returns user defined attributes of the given model (removed ones inherited from sequelize)
export type NonModelAttributes<T extends Model<any, any>> = Omit<
  T,
  keyof Model<InferAttributes<T>, InferCreationAttributes<T>>
>;

// Makes sure that the 2nd type is a subset of the first (i.e. to make sure the 2nd type only has fields that are in the 1st type)
export type Subset<T extends U, U> = U;
