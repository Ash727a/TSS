import WebSocket from 'ws';

const socketUrl = 'ws://localhost:3001';
const teamName = 'Test Team 1';
const vkguid = 'fdbee7e5-9887-495e-aabb-f10d1386a7e9';

const ws = new WebSocket(socketUrl);

ws.on('open', () => {
  console.log(teamName);
  const data = {
    MSGTYPE: 'DATA',
    BLOB: {
      DATATYPE: 'CREWMEMBER',
      DATA: {
        username: teamName,
        user_guid: vkguid,
        university: 'Some Uni',
      },
    },
  };

  ws.send(JSON.stringify(data));
});

ws.on('message', (message) => {
  console.log('Message Received');
  console.log(message.toString());
});
