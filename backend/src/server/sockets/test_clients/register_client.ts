import WebSocket from 'ws';

const socketUrl = 'ws://localhost:3001';
const teamName = 'TestTeam1';
//const clientId = 'ef0110ad-cd77-413d-af5e-88cd4091f50c';
//const clientId = 'abcr121d-cd77-413d-af5e-88cd4091f50c';
const clientId = 'cd77-413d-af5e-88cd4091f50c';
const roomId = '1';
const vkguid = 'fdbee7e5-9887-495e-aabb-f10d1386a7e9'


const ws = new WebSocket(socketUrl);

ws.on('open', () => {
  console.log(teamName);
  const data = {
    MSGTYPE: 'DATA',
    BLOB: {
      DATATYPE: 'CREWMEMBER',
      DATA: {
        username: teamName,
        room_id: roomId,
        client_id: clientId,
        vk_guid: vkguid,
      },
    },
  };

  ws.send(JSON.stringify(data));
});

ws.on('message', (message) => {
  console.log(message.toString());
});
