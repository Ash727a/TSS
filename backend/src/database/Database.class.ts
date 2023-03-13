import path from 'path';
import { Model, ModelCtor, Sequelize } from 'sequelize-typescript';

class Database {
  private fileName: string;
  private dbPath: string;
  private models: (string | ModelCtor<Model<any, any>>)[] = [];
  public sequelize: Sequelize;

  private static readonly DEFAULT_CONFIG: object = {
    dialect: 'sqlite',
    logQueryParameters: false,
    logging: false, // Set to console.log for developer mode (shows the SQL statements executed in terminal), false to be less verbose
    benchmark: true,
  };
  constructor(_fileName: string, sequelizeConfig: object = {}, models: (string | ModelCtor<Model<any, any>>)[] = []) {
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
    this.setModels(models);
  }

  public async setModels(models: (string | ModelCtor<Model<any, any>>)[]): Promise<void> {
    this.sequelize.addModels(models);
    await this.sequelize.sync(); // Update database schema to match models
    this.models = models;
  }

  public getModels(): (string | ModelCtor<Model<any, any>>)[] {
    return this.models;
  }
}

export default Database;
