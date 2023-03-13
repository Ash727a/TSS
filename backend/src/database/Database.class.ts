import path from 'path';
import { Model, ModelCtor, Sequelize } from 'sequelize-typescript';

/** CLASS: Database
 * @initialize_with await Database.build(<filename>, <modelsArray>, <sequelizeConfig>);
 */

class Database {
  private fileName: string;
  private dbPath: string;
  public sequelize: Sequelize;

  private static readonly DEFAULT_CONFIG: object = {
    dialect: 'sqlite',
    logQueryParameters: false,
    logging: false, // Set to console.log for developer mode (shows the SQL statements executed in terminal), false to be less verbose
    benchmark: true,
  };
  private constructor(_fileName: string, sequelizeConfig: object = {}) {
    // Configure the path to the database file
    this.fileName = _fileName + '.sqlite';
    const appDir = path.resolve(process.cwd());
    const _dbPath = path.join(appDir, 'src', 'database', 'local-sqlite-database');
    this.dbPath = path.join(_dbPath, this.fileName);
    // Set up config for new Sequelize instance
    const config = {
      ...Database.DEFAULT_CONFIG,
      storage: this.dbPath,
      ...sequelizeConfig,
    };
    this.sequelize = new Sequelize(config);
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
    this.sequelize.addModels(models);
    try {
      await this.sequelize.sync(); // Update database schema to match models
    } catch (error) {
      console.log('error', error);
      return false;
    }
    return true;
  }

  public getModels(): {
    [key: string]: ModelCtor<Model>;
  } {
    return this.sequelize.models as { [key: string]: ModelCtor<Model> };
  }
}

export default Database;
