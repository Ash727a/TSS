import { IAllModels } from '../../../database/models/index.js';
import type { IRosTypeSensorMsgsNavSatFix } from './roverInterfaces';
import { Ros, Topic, Message } from 'roslib';

const SOCKET_URL = 'ws://192.168.0.105:9090';

export class RoverSocketServer {
  private readonly _ros: Ros;

  constructor(_models: IAllModels, socket_port: number) {
    this._ros = new Ros({
      url: SOCKET_URL,
    });
    this.initializeListeners();

    const cmdVel = new Topic({
      ros: this._ros,
      name: '/cmd_vel',
      messageType: 'geometry_msgs/Twist',
    });

    const twist = new Message({
      lat: 0,
      lon: 0,
    });
    console.log('Publishing cmd_vel');
    cmdVel.publish(twist);
  }

  private initializeListeners(): void {
    this._ros.on('connection', function () {
      console.log('Connected to websocket server.');
    });

    this._ros.on('error', function (error) {
      console.log('Error connecting to websocket server: ', error);
    });

    this._ros.on('close', function () {
      console.log('Connection to websocket server closed.');
    });
  }

  public isConnected(): boolean {
    return this._ros.isConnected;
  }
}
