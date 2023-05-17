import { IAllModels } from '../../../database/models/index.js';
import type { IRosTypeSensorMsgsNavSatFix } from './roverInterfaces';
import ROSLIB from 'roslib';

// const SOCKET_URL = 'ws://192.168.0.105:9090';
const SOCKET_URL = 'ws://leo-raspi.local:9090';

const WHERE_CONSTRAINT = { where: { name: 'rover' } } as const;
const HEARTBEAT_INTERVAL = 1000;
const COMMAND_INTERVAL = 1000;

export class RoverSocketServer {
  private readonly _ros: ROSLIB.Ros;
  private readonly models: IAllModels;
  private hbInterval: ReturnType<typeof setTimeout> | undefined = undefined;
  private commandInterval: ReturnType<typeof setTimeout> | undefined = undefined;
  private roverIsConnected = false;

  constructor(_models: IAllModels) {
    this.models = _models;
    this._ros = new ROSLIB.Ros({
      url: SOCKET_URL,
    });
    // On initial connection, set rover device to disconnected (in case it was an ungraceful shutdown)
    this.models.devices.update({ is_connected: false }, WHERE_CONSTRAINT);

    // Set up socket event listeners
    this.initializeSocketListeners();
    this.pollForCommands();
  }

  private initializeSocketListeners(): void {
    this._ros.on('connection', () => {
      console.log('Connected to ROVER websocket server.');
      this.models.devices.update({ is_connected: true, connected_at: new Date() }, WHERE_CONSTRAINT);
      this.roverIsConnected = true;
      this.hbInterval = setInterval(() => {
        this.sendHeartbeatMessage();
      }, HEARTBEAT_INTERVAL);
    });

    this._ros.on('error', (error) => {
      // console.log('Error connecting to ROVER websocket server: ', error);
      console.log('Error connecting to ROVER websocket server');
      this.models.devices.update({ is_connected: false }, WHERE_CONSTRAINT);
      this.connect();
      this.roverIsConnected = false;
    });

    this._ros.on('close', () => {
      console.log('Connection to ROVER websocket server closed.');
      this.models.devices.update({ is_connected: false }, WHERE_CONSTRAINT);
      clearInterval(this.hbInterval);
      this.connect();
    });
  }

  private sendHeartbeatMessage(): void {
    const heartbeatTopic = new ROSLIB.Topic({
      ros: this._ros,
      name: '/stop_movement',
      messageType: 'std_msgs/Bool',
    });
    // Send empty message as a heartbeat to rover
    const heartbeatMessage = new ROSLIB.Message({ data: false });
    heartbeatTopic.publish(heartbeatMessage);
  }

  private async pollForCommands(): Promise<void> {
    this.commandInterval = setInterval(async () => {
      // If the rover isn't connected, don't poll it backend for commands
      if (!this.roverIsConnected) {
        console.log('rover not connected');
        return;
      }
      const deviceResult = await this.models.devices.findOne({ where: { name: 'rover' } });
      if (deviceResult === null) {
        console.log('No rover device found');
        return;
      }
      const room_id = deviceResult.room_id;
      const roverResult = await this.models.rover.findOne({ where: { room_id: room_id } });
      if (roverResult === null || !roverResult?.dataValues) {
        console.log('No rover found for room');
        return;
      }
      // Command received. Send to rover
      // console.log('sending', roverResult)
      // console.log('sending rover cmd');
      this.sendRoverCommand(roverResult.dataValues);
    }, COMMAND_INTERVAL);
  }

  private sendRoverCommand(roverResult: any): void {
    let roverTopic: ROSLIB.Topic<ROSLIB.Message>;
    let roverMessage: ROSLIB.Message;
    if (!roverResult.cmd) {
      return;
    }
    console.log('SENDING ROVER', roverResult);
    switch (roverResult.cmd) {
      // case 'navigate': {
      //   roverTopic = new ROSLIB.Topic({
      //     ros: this._ros,
      //     name: '/cmd_vel',
      //     messageType: 'geometry_msgs/Twist',
      //   });
      //   break;
      // }
      // case 'recall': {
      //   roverTopic = new ROSLIB.Topic({
      //     ros: this._ros,
      //     name: '/recall',
      //     messageType: 'std_msgs/Empty',
      //   });
      //   break;
      // }
      case 'stop': {
        console.log('Sending STOP command to rover');
        roverTopic = new ROSLIB.Topic({
          ros: this._ros,
          name: '/system/shutdown',
          messageType: 'std_msgs/Empty',
        });
        roverMessage = new ROSLIB.Message({});
        break;
      }
      default: {
        console.log(`Invalid rover command: ${roverResult.cmd}`);
        return;
      }
    }
    roverTopic.publish(roverMessage);
  }

  public isConnected(): boolean {
    return this._ros.isConnected;
  }

  public connect(): void {
    this._ros.connect(SOCKET_URL);
  }
}
