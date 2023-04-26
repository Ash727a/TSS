import WebSocket from 'ws';
import { isValidRockId, spec_data_map } from '../events/mappings/spec_data.map.js';
import * as util from 'node:util';
import { SpecMsg } from '../socketInterfaces';

const spec_keys = Object.keys(spec_data_map);

const socketUrl = 'ws://localhost:3001';

const ws = new WebSocket(socketUrl);

function make_spec_msg(test_tag_id: string): SpecMsg {
  const data = {
    MSGTYPE: 'DATA',
    BLOB: {
      DATATYPE: 'SPEC',
      DATA: {
        TAG_ID: test_tag_id,
      },
    },
  } as const;

  return data;
}

ws.on('open', () => {
  const test_tag_id = spec_keys[0]; // This line makes valid data to send
  // const test_tag_id = 'some random nonsense'   // Just replace this with some random string
  const data = make_spec_msg(test_tag_id);

  ws.send(JSON.stringify(data));

  if (isValidRockId(test_tag_id)) {
    console.log(`Sending valid tag: ${test_tag_id}\n Should map to:${util.inspect(spec_data_map[test_tag_id])}`);
  } else {
    console.log(`Sending invalid tag: ${test_tag_id}`);
  }
});

ws.on('message', (message) => {
  console.log(message.toString());
});
