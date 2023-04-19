/**
 * This file contains the configuration for constants in the backend.
 */

/**
 * The list of teams. Used to populate the database.
 * @type {Array<{name: string}>}
 * @constant teams
 * @memberof config
 * @usedAt backend/src/database/local-sqlite-database/seed/setup.ts
 */
export const teams = [
  { name: 'alpha' },
  { name: 'beta' },
  { name: 'gamma' },
  { name: 'delta' },
  { name: 'eplsilon' },
  { name: 'zeta' },
  { name: 'eta' },
  { name: 'theta' },
  { name: 'iota' },
  { name: 'kappa' },
  { name: 'lambda' },
  { name: 'mu' },
];

/**
 * The list of vision kit mappings.
 * @type {Array<{name: string, guid: string}>}
 * @constant visionKits
 * @memberof config
 * @usedAt backend/src/database/local-sqlite-database/seed/setup.ts
 */

/**
 * Live database file name. No need to add '.sqlite' extension.
 * @type {string}
 * @constant liveDatabaseName
 * @memberof config
 * @usedAt backend/src/index.ts
 */
export const liveDatabaseName = 'suits';

/**
 * Log database file name. No need to add '.sqlite' extension.
 * @type {string}
 * @constant logDatabaseName
 * @memberof config
 * @usedAt backend/src/index.ts
 */
export const logDatabaseName = 'logs';
