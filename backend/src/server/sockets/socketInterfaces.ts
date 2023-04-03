import type { Subset } from '../../database/models/interfaceHelpers';
import type { UserCreationAttributes } from '../../database/models/teams/user.model';

export interface SocketMsg<T> {
  MSGTYPE: 'DATA';
  BLOB: T;
}

export interface UnknownMsgBlob {
  DATATYPE: 'CREWMEMBER' | 'IMU' | 'GPS' | 'SPEC';
}
export type UnknownMsg = SocketMsg<UnknownMsgBlob>;

export interface CrewmemberBlob {
  DATATYPE: 'CREWMEMBER';
  DATA: Subset<
    UserCreationAttributes,
    {
      username: string;
      user_guid: string;
    }
  >;
}
export type CrewmemberMsg = SocketMsg<CrewmemberBlob>;

export interface IMUMsgBlob {
  DATATYPE: 'IMU';
  DATA: ImuData;
}
export type IMUMsg = SocketMsg<IMUMsgBlob>;

interface GPSMsg<T extends GPSMsgDataBase> {
  DATATYPE: 'GPS';
  DATA: T;
}

interface GPSMsgDataBase {
  class: 'TPV';
  device: string;
  mode: 0 | 1 | 2 | 3;
}
export type GPSMsgBase = SocketMsg<GPSMsg<GPSMsgDataBase>>;

interface GPSMsgDataNoFix extends GPSMsgDataBase {
  mode: 1;
  time: string;
  ept: number;
}
export type GPSMsgNoFix = SocketMsg<GPSMsg<GPSMsgDataNoFix>>;

interface GPSMsgDataFix extends GPSMsgDataBase {
  mode: 2;
  time: string;
  alt: string;
  climb: number;
  epx: number;
  epv: number;
  ept: number;
  eps: number;
  lat: number;
  lon: number;
  speed: number;
  track: number;
  epc: number;
  epy: number;
}
export type GPSMsgFix = SocketMsg<GPSMsg<GPSMsgDataFix>>;

interface SpecMsgBlob extends UnknownMsgBlob {
  DATATYPE: 'SPEC';
  DATA: {
    TAG_ID: string;
  };
}
export type SpecMsg = SocketMsg<SpecMsgBlob>;
