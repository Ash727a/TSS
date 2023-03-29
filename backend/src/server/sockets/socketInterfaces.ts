import type { Subset } from '../../database/models/interfaceHelpers';
import type { UserCreationAttributes } from '../../database/models/teams/user.model';
import type { GpsData } from '../../database/models/teams/visionKitData/gpsMsg.model';
import type { ImuData } from '../../database/models/teams/visionKitData/imuMsg.model';

export interface SocketMsg<T> {
  MSGTYPE: 'DATA';
  BLOB: T;
}

export interface CrewmemberBlob {
  DATATYPE: 'CREWMEMBER';
  DATA: Subset<
    UserCreationAttributes,
    {
      username: string;
      guid: string;
    }
  >;
}
export type CrewmemberMsg = SocketMsg<CrewmemberBlob>;

export interface UnknownMsgBlob {
  DATATYPE: 'CREWMEMBER' | 'IMU' | 'GPS' | 'UIA';
  DATA: any;
}
export type UnknownMsg = SocketMsg<UnknownMsgBlob>;

export interface IMUMsgBlob {
  DATATYPE: 'IMU';
  DATA: ImuData;
}
export type IMUMsg = SocketMsg<IMUMsgBlob>;

export interface GPSMsgBlob {
  DATATYPE: 'GPS';
  DATA: GpsData;
}
export type GPSMsg = SocketMsg<GPSMsgBlob>;
