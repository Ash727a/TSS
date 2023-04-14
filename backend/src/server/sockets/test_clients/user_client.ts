import WebSocket from 'ws';

const socketUrl = 'ws://localhost:3001';

interface TestUser {
  teamName: string;
  vkguid: string;
  university: string;
}

const test_user_1: TestUser = {
  teamName: 'Test Team 1',
  vkguid: 'fdbee7e5-9887-495e-aabb-f10d1386a7e9',
  university: 'Uni 1',
};

const test_user_2: TestUser = {
  teamName: 'Test Team 2',
  vkguid: 'some_guid',
  university: 'Uni 2',
};

function connect_user(test_user: TestUser): void {
  const ws = new WebSocket(socketUrl);

  ws.on('open', () => {
    console.log(test_user.teamName);
    const data = {
      MSGTYPE: 'DATA',
      BLOB: {
        DATATYPE: 'CREWMEMBER',
        DATA: {
          username: test_user.teamName,
          user_guid: test_user.vkguid,
          university: test_user.university,
        },
      },
    };

    ws.send(JSON.stringify(data));
  });

  ws.on('message', (message) => {
    console.log('Message Received');
    console.log(message.toString());
  });
}

connect_user(test_user_1);
