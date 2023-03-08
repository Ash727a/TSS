import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', (d: any) => {
  console.log('opened');
  console.log(ws.readyState);

  const macaddr = '1F-4E-B3-1A-9D-05';
  const msg = { MSGTYPE: 'DATA', MACADDRESS: macaddr, BLOB: { DATATYPE: 'HMD', DATA: null } };
  ws.send(JSON.stringify(msg));
});
ws.on('message', (m) => {
  console.log(m.toString());
});
