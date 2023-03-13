import { Model, Optional } from 'sequelize';

import { getIdParam } from '../helpers.js';
import Route from './Route.class.js';

class auth extends Route {
  constructor(_model: any) {
    super(_model);
  }
}

export default auth;
