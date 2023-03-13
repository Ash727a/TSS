import path from 'path';
import { Model, ModelCtor, Sequelize } from 'sequelize-typescript';

/** CLASS: Database
 * @initialize_with await Database.build(<filename>, <modelsArray>, <sequelizeConfig>);
 * @description This class is a wrapper around the Sequelize class. It is used to create a new Sequelize instance with a specific database file.
 * @extends Sequelize
 */

class Database extends Sequelize {
  private static readonly DEFAULT_CONFIG: object = {
    dialect: 'sqlite',
    logQueryParameters: false,
    logging: false, // Set to console.log for developer mode (shows the SQL statements executed in terminal), false to be less verbose
    benchmark: true,
  };

  private constructor(_fileName: string, sequelizeConfig: object = {}) {
    // Configure the path to the database file
    const appDir = path.resolve(process.cwd());
    const _dbDirectory = path.join(appDir, 'src', 'database', 'local-sqlite-database');
    _fileName = _fileName + '.sqlite';
    const _dbPath = path.join(_dbDirectory, _fileName);
    // Set up config for new Sequelize instance
    const config = {
      ...Database.DEFAULT_CONFIG,
      storage: _dbPath,
      ...sequelizeConfig,
    };
    super(config);
  }

  public static async build(
    _fileName: string,
    models: (string | ModelCtor<Model<any, any>>)[],
    sequelizeConfig: object = {}
  ): Promise<Database> {
    const _db = new Database(_fileName, sequelizeConfig);
    await _db.setModels(models);
    return _db;
  }

  public async setModels(models: (string | ModelCtor<Model<any, any>>)[]): Promise<boolean> {
    this.addModels(models);
    try {
      await this.sync(); // Update database schema to match models
    } catch (error) {
      console.log('error', error);
      return false;
    }
    return true;
  }

  public getModels(): {
    [key: string]: ModelCtor<Model>;
  } {
    return this.models as { [key: string]: ModelCtor<Model> };
  }
}

export default Database;
