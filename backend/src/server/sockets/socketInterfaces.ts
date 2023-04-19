import type { Subset } from '../../database/models/interfaceHelpers';
import type { UserCreationAttributes } from '../../database/models/teams/user.model';

export const enum DATATYPE {
  'HMD' = 'HMD',
  'IMU' = 'IMU',
  'GPS' = 'GPS',
  'SPEC' = 'SPEC',
}

interface SocketMsg {
  MSGTYPE: 'DATA';
  // BLOB: SomeType
}

export interface UnknownMsg extends SocketMsg {
  BLOB: UnknownMsgBlob;
}

interface UnknownMsgBlob {
  DATATYPE: keyof typeof DATATYPE;
}

export interface CrewmemberMsg extends SocketMsg {
  BLOB: CrewmemberBlob;
}

interface CrewmemberBlob {
  DATATYPE: 'HMD';
  DATA: CrewmemberData;
}

type CrewmemberData = Subset<
  UserCreationAttributes,
  {
    team_name: string;
    username: string;
    user_guid: string;
    university: string;
  }
>;

export interface IMUMsg {
  MACADDRESS: string;
  BLOB: ImuMsgBlob;
}

interface ImuMsgBlob {
  DATATYPE: 'IMU';
  DATA: ImuMsgData;
}

interface ImuMsgData {
  accel_x: number;
}

export interface GpsMsg extends SocketMsg {
  MACADDRESS: string;
  BLOB: GPSMsgBlob;
}

interface GPSMsgBlob {
  DATATYPE: 'GPS';
  DATA: GPSMsgData;
}

interface GPSMsgData {
  class?: 'TPV';
  device?: string;
  mode: number;
  time?: string;
  alt?: number;
  climb?: number;
  epx?: number;
  epv?: number;
  ept?: number;
  eps?: number;
  lat?: number;
  lon?: number;
  speed?: number;
  track?: number;
  epc?: number;
  epy?: number;
}

export interface SpecMsg extends SocketMsg {
  BLOB: SpecMsgBlob;
}

interface SpecMsgBlob {
  DATATYPE: 'SPEC';
  DATA: {
    TAG_ID: string;
  };
}
