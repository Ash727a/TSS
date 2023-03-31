import WebSocket from 'ws';

const socketUrl = 'ws://localhost:3001';
const teamName = 'Test Team 1';
//const clientId = 'ef0110ad-cd77-413d-af5e-88cd4091f50c';
//const clientId = 'abcr121d-cd77-413d-af5e-88cd4091f50c';
const vkguid = 'fdbee7e5-9887-495e-aabb-f10d1386a7e9';

const ws = new WebSocket(socketUrl);

ws.on('open', () => {
  const data = {
    MSGTYPE: 'DATA',
    BLOB: {
      DATATYPE: 'SPEC',
      DATA: {
        TAG_ID: 'id-1',
      },
    },
  };

  ws.send(JSON.stringify(data));
});

ws.on('message', (message) => {
  console.log(message.toString());
});
