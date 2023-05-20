const http = require('follow-redirects').http;
const fs = require('fs');

const options = {
  method: 'PUT',
  hostname: 'localhost',
  port: 8080,
  path: '/api/updateuia',
  headers: {
    'Content-Type': 'application/json',
  },
  maxRedirects: 20,
};

const req = http.request(options, function (res) {
  const chunks = [];

  res.on('data', function (chunk) {
    chunks.push(chunk);
  });

  res.on('end', function (chunk) {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });

  res.on('error', function (error) {
    console.error(error);
  });
});

const postData = JSON.stringify({
  emu1_pwr_switch: false,
  ev1_supply_switch: false,
  ev1_water_waste_switch: false,
  emu1_o2_supply_switch: false,
  o2_vent_switch: false,
  depress_pump_switch: false,
});

req.write(postData);

req.end();
