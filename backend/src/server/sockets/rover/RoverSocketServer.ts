import { IAllModels } from '../../../database/models/index.js';
import type { IRosTypeSensorMsgsNavSatFix } from './roverInterfaces';
import ROSLIB from 'roslib';

// const SOCKET_URL = 'ws://192.168.0.105:9090';
const SOCKET_URL = 'ws://leo-raspi.local:9090';

const WHERE_CONSTRAINT = { where: { name: 'rover' } } as const;

export class RoverSocketServer {
  private readonly _ros: ROSLIB.Ros;
  private readonly models: IAllModels;
  private hbInterval: ReturnType<typeof setTimeout> | undefined = undefined;

  constructor(_models: IAllModels) {
    this.models = _models;
    this._ros = new ROSLIB.Ros({
      url: SOCKET_URL,
    });
    // On initial connection, set rover device to disconnected (in case it was an ungraceful shutdown)
    this.models.devices.update({ is_connected: false }, WHERE_CONSTRAINT);

    // Set up socket event listeners
    this.initializeSocketListeners();

    // const cmdVel = new ROSLIB.Topic({
    //   ros: this._ros,
    //   name: '/cmd_vel',
    //   messageType: 'geometry_msgs/Twist',
    // });

    // const twist = new ROSLIB.Message({
    //   lat: 0,
    //   lon: 0,
    // });
    // console.log('Publishing cmd_vel');
    // cmdVel.publish(twist);
  }

  private initializeSocketListeners(): void {
    this._ros.on('connection', () => {
      console.log('Connected to ROVER websocket server.');
      this.models.devices.update({ is_connected: true, connected_at: new Date() }, WHERE_CONSTRAINT);

      this.hbInterval = setInterval(() => {
        this.sendEmptyMessage();
      }, 1000);
    });

    this._ros.on('error', (error) => {
      console.log('Error connecting to ROVER websocket server: ', error);
      this.models.devices.update({ is_connected: false }, WHERE_CONSTRAINT);
      this.connect();
    });

    this._ros.on('close', () => {
      console.log('Connection to ROVER websocket server closed.');
      this.models.devices.update({ is_connected: false }, WHERE_CONSTRAINT);
      clearInterval(this.hbInterval);
      this.connect();
    });
  }

  private sendEmptyMessage(): void {
    const heartbeatTopic = new ROSLIB.Topic({
      ros: this._ros,
      name: '/stop_movement',
      messageType: 'std_msgs/Empty',
    });
    // Send empty message as a heartbeat to rover
    const heartbeatMessage = new ROSLIB.Message({});
    heartbeatTopic.publish(heartbeatMessage);
  }

  public isConnected(): boolean {
    return this._ros.isConnected;
  }

  public connect(): void {
    this._ros.connect(SOCKET_URL);
  }
}
