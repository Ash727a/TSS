import { InferCreationAttributes } from 'sequelize';
import WebSocket from 'ws';
import user from '../../../database/models/teams/user.model';

const socketUrl = 'ws://localhost:3001';

interface TestUser {
  team_name: string;
  username: string;
  university: string;
  user_guid: string;
}

const test_user_1: TestUser = {
  team_name: 'Test Team 1',
  username: 'User 1',
  university: 'Uni 1',
  user_guid: 'fdbee7e5-9887-495e-aabb-f10d1386a7e9',
};

const test_user_2: TestUser = {
  team_name: 'Test Team 2',
  username: 'User 2',
  university: 'Uni 2',
  user_guid: 'some_guid',
};

function connect_user(test_user: TestUser): void {
  const ws = new WebSocket(socketUrl);

  ws.on('open', () => {
    console.log(`Attempting to register team ${test_user.team_name}`);
    const data = {
      MSGTYPE: 'DATA',
      BLOB: {
        DATATYPE: 'HMD',
        DATA: {
          ...test_user,
        },
      },
    };

    ws.send(JSON.stringify(data));
    const payload = {
      rover: {
        cmd: 'navigate',
        goal_lat: 1.0,
        goal_lon: 2.0,
      },
    };
    setTimeout(() => {
      console.log('Sending payload...', payload);
      ws.send(JSON.stringify(payload));
    }, 2000);
  });

  ws.on('message', (message) => {
    console.log('Message Received:');
    console.log(message.toString());
  });

  ws.on('close', (code, reason) => {
    console.log(`ws closed with code ${code} and reason: ${reason}`);
  });
}

connect_user(test_user_1);
