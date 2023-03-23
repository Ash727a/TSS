export interface SocketMsg<T extends MsgBlob> {
  MSGTYPE: 'DATA';
  BLOB: T;
}

export interface MsgBlob {
  DATATYPE: string;
}

export interface CrewmemberMsgBlob extends MsgBlob {
  DATATYPE: 'CREWMEMBER';
  DATA: {
    room_id: number;
    username: string;
    client_id: string;
  };
}
export type CrewmemberMsg = SocketMsg<CrewmemberMsgBlob>;

export interface UnknownMsgBlob extends MsgBlob {
  DATA: any;
}
export type UnknownMsg = SocketMsg<UnknownMsgBlob>;

export interface IMUMsgBlob extends MsgBlob {
  DATATYPE: 'IMU';
  DATA: {
    room_id: number;
    username: string;
    client_id: number;
  };
}
export type IMUMsg = SocketMsg<IMUMsgBlob>;

export interface GPSMsgBlob extends MsgBlob {
  DATATYPE: 'GPS';
  DATA: {
    room_id: number;
    username: string;
    client_id: number;
  };
}
export type GPSMsg = SocketMsg<GPSMsgBlob>;
