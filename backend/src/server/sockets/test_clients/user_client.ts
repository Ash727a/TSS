import { InferCreationAttributes } from 'sequelize';
import WebSocket from 'ws';
import user from '../../../database/models/teams/user.model';

const socketUrl = 'ws://localhost:3001';
// const socketUrl = 'ws://192.168.52.201:3001';
const VERBOSE = true;

interface TestUser {
  team_name: string;
  username: string;
  university: string;
  user_guid: string;
}

const TestUsers = {
  claws: {
    team_name: 'CLAWS',
    username: 'Patrick',
    university: 'U Michigan',
    user_guid: 'eb0dde22-a403-45cd-a3bc-45c797634d32',
  } as const,
  interscholar: {
    team_name: 'Interscholar',
    username: 'IS',
    university: 'Cerritos | College of the Desert | CSU Fullerton',
    user_guid: 'a75e207e-f70f-4e4f-a66a-9f47bb84ab29',
  } as const,
} as const;

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
    if (VERBOSE) {
      console.log('Message Received:');
      console.log(message.toString());
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`ws closed with code ${code} and reason: ${reason}`);
  });
}

connect_user(TestUsers.interscholar);
