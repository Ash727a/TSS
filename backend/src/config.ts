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
  {
    name: 'AEGIS',
    username: 'VK01',
    university: 'University of Southern California | UC Berkeley',
    user_guid: 'fdbee7e5-9887-495e-aabb-f10d1386a7e9',
  },
  {
    name: 'Interscholar',
    username: 'VK02',
    university: 'Cerritos | College of the Desert | CSU Fullerton',
    user_guid: 'a75e207e-f70f-4e4f-a66a-9f47bb84ab29',
  },
  {
    name: 'TerpVISIO',
    username: 'VK03',
    university: 'University of Maryland, College Park | University of Maryland, Baltimore County',
    user_guid: '9e93f00f-2051-40e1-b8fe-6fa6706a6cab',
  },
  {
    name: 'CLAWS',
    username: 'VK04',
    university: 'University of Michigan',
    user_guid: 'eb0dde22-a403-45cd-a3bc-45c797634d32',
  },
  {
    name: 'RISD',
    username: 'VK05',
    university: 'Rhode Island School of Design',
    user_guid: 'cab500cc-d4ab-4ddc-98e4-780bd720a30c',
  },
  {
    name: '12th Astronaut',
    username: 'VK06',
    university: 'Texas A&M University',
    user_guid: 'a0234122-37fe-47ae-a09a-ffc3c548e20c',
  },
  {
    name: 'Astrohuskies',
    username: 'VK07',
    university: 'University of Washington',
    user_guid: 'e8363b52-09fc-4dd2-8072-ed92f431cc65',
  },
  {
    name: 'RED-MORTI',
    username: 'VK08',
    university: 'University of Nebraska-Lincoln',
    user_guid: '66b6f3a5-63ca-4c49-95d1-e64d3a85a3a9',
  },
  {
    name: 'Westside Dynamics',
    username: 'VK09',
    university: 'Riverside City College | Norco College',
    user_guid: 'af905783-78fc-465f-b965-be404b104d0f',
  },
  {
    name: 'Archimedes',
    username: 'VK010',
    university: 'Rice University',
    user_guid: 'b16f5bff-a93a-48c1-bfd9-6d74dec1b144',
  },
  // Copied from TerpVision and modified
  {
    name: 'Test User',
    username: 'VK11',
    university: 'D.U.',
    user_guid: 'icecream-2051-40e1-b8fe-6fa6706a6cab',
  },
];

/**
 * The list of devices. Used to populate the database.
 * @type {Array<{name: string}>}
 * @constant devices
 * @memberof config
 * @usedAt backend/src/database/local-sqlite-database/seed/setup.ts
 */
export const devices = [
  {
    name: 'rover',
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
