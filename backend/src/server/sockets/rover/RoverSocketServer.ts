import { IAllModels } from '../../../database/models/index.js';
import type { IRosTypeSensorMsgsNavSatFix } from './roverInterfaces';
import ROSLIB from 'roslib';

const SOCKET_URL = 'ws://192.168.0.105:9090';

export class RoverSocketServer {
  private readonly _ros: ROSLIB.Ros;
  private readonly models: IAllModels;

  constructor(_models: IAllModels) {
    this.models = _models;
    this._ros = new ROSLIB.Ros({
      url: SOCKET_URL,
    });
    this.initializeSocketListeners();

    const cmdVel = new ROSLIB.Topic({
      ros: this._ros,
      name: '/cmd_vel',
      messageType: 'geometry_msgs/Twist',
    });

    const twist = new ROSLIB.Message({
      lat: 0,
      lon: 0,
    });
    console.log('Publishing cmd_vel');
    cmdVel.publish(twist);
  }

  private initializeSocketListeners(): void {
    const whereConstraint = { where: { name: 'rover' } };
    this._ros.on('connection', () => {
      console.log('Connected to websocket server.');
      this.models.devices.update({ is_connected: true, connected_at: new Date() }, whereConstraint);
    });

    this._ros.on('error', (error) => {
      console.log('Error connecting to websocket server: ', error);
      this.models.devices.update({ is_connected: false }, whereConstraint);
    });

    this._ros.on('close', () => {
      console.log('Connection to websocket server closed.');
      this.models.devices.update({ is_connected: false }, whereConstraint);
    });
  }

  public isConnected(): boolean {
    return this._ros.isConnected;
  }
}
