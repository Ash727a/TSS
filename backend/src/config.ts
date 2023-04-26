/**
 * This file contains the configuration for constants in the backend.
 */

/**
 * If you'd like verbose console logs, set this to true.
 */
export const VERBOSE = false;

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
export const visionKits = [
  {
    name: 'VK01',
    guid: 'fdbee7e5-9887-495e-aabb-f10d1386a7e9',
  },

  {
    name: 'VK02',
    guid: 'a75e207e-f70f-4e4f-a66a-9f47bb84ab29',
  },

  {
    name: 'VK03',
    guid: '9e93f00f-2051-40e1-b8fe-6fa6706a6cab',
  },

  {
    name: 'VK04',
    guid: 'eb0dde22-a403-45cd-a3bc-45c797634d32',
  },

  {
    name: 'VK05',
    guid: 'cab500cc-d4ab-4ddc-98e4-780bd720a30c',
  },

  {
    name: 'VK06',
    guid: 'a0234122-37fe-47ae-a09a-ffc3c548e20c',
  },

  {
    name: 'VK07',
    guid: 'e8363b52-09fc-4dd2-8072-ed92f431cc65',
  },

  {
    name: 'VK08',
    guid: '66b6f3a5-63ca-4c49-95d1-e64d3a85a3a9',
  },

  {
    name: 'VK09',
    guid: 'af905783-78fc-465f-b965-be404b104d0f',
  },

  {
    name: 'VK10',
    guid: 'b16f5bff-a93a-48c1-bfd9-6d74dec1b144',
  },
];

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
