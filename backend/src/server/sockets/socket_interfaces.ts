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

export interface UnknownMsgBlob extends MsgBlob {
  DATA: any;
}

export interface IMUMsgBlob extends MsgBlob {
  DATATYPE: 'IMU';
  DATA: {
    room_id: number;
    username: string;
    client_id: number;
  };
}

export interface GPSMsgBlob extends MsgBlob {
  DATATYPE: 'GPS';
  DATA: {
    room_id: number;
    username: string;
    client_id: number;
  };
}
