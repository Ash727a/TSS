import path from 'path';
import { Sequelize } from 'sequelize-typescript';

import { SequelizeModel } from '../interfaces.js';

/** CLASS: Database
 * @initialize_with await Database.build(<filename>, <modelsArray>, <sequelizeConfig>);
 * @description This class is a wrapper around the Sequelize class. It is used to create a new Sequelize instance with a specific database file.
 * @extends Sequelize
 */

class Database<IModels> extends Sequelize {
  private static readonly DEFAULT_CONFIG: object = {
    dialect: 'sqlite',
    logQueryParameters: false,
    logging: false, // Set to console.log for developer mode (shows the SQL statements executed in terminal), false to be less verbose
    benchmark: true,
  };

  /**
   * Used as a static method to create a new Database instance. Use this instead of the constructor to initialize a new Database instance.
   * @param {string} _fileName Name of the database file (without .sqlite extension)
   * @param {_IModels} models Array of model names or model constructors
   * @param {object} sequelizeConfig Optional config object to pass to the Sequelize constructor
   * @returns {Promise<Database>} Promise that resolves to a new Database instance
   */
  public static async build<_IModels>(
    _fileName: string,
    models: _IModels,
    sequelizeConfig: object = {}
  ): Promise<Database<_IModels>> {
    const _db: Database<_IModels> = new Database(_fileName, sequelizeConfig); // Create a new Database instance (itself)
    await _db.setModels(models); // Set the models for the new Database instance
    return _db; // Return the new Database instance
  }

  /**
   * Use the static build() method instead of this constructor. This constructor is privately used to help the build() method.
   * @param {string} _fileName Name of the database file (without .sqlite extension)
   * @param {object} sequelizeConfig Optional config object to pass to the Sequelize constructor
   */
  private constructor(_fileName: string, sequelizeConfig: object = {}) {
    // Configure the path to the database file
    const appDir: string = path.resolve(process.cwd());
    const _dbDirectory: string = path.join(appDir, 'src', 'database', 'local-sqlite-database');
    _fileName = _fileName + '.sqlite';
    const _dbPath: string = path.join(_dbDirectory, _fileName);
    // Set up config for new Sequelize instance
    const config = {
      ...Database.DEFAULT_CONFIG,
      storage: _dbPath,
      ...sequelizeConfig,
    };
    super(config); // Call the Sequelize constructor
  }

  /**
   * Add models to the Database instance
   * @param {IModels models Array of model names or model constructors
   * @returns {boolean} True if models were added successfully, false otherwise
   */
  public async setModels(models: IModels): Promise<boolean> {
    this.addModels(Object.values(models as object) as []); // Add models to the Database / native Sequelize instance
    try {
      await this.sync(); // Update database schema to match models
    } catch (error) {
      console.log('error', error);
      return false;
    }
    return true;
  }

  /**
   * Getter method for the models from the Database instance
   * @returns {{ [key: string]: SequelizeModel }} Object containing the models
   */
  public getModels(): IModels {
    // Convert array into key value pair object, the name being the model name
    return this.models as IModels;
  }
}

export default Database;
