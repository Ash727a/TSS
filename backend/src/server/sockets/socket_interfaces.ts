export interface SocketData {
  MSGTYPE: 'DATA';
  BLOB: {
    DATATYPE: 'CREWMEMBER' | 'GEO' | 'IMU' | 'GPS';
    DATA: {
      [key: string]: any;
    };
  };
}
