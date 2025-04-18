const http = require('http');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 0 }, function () {
  // Required WebSocket headers
  const headers = {
    Connection: 'Upgrade',
    Upgrade: 'websocket',
    'Sec-WebSocket-Key': 'dGhlIHNhbXBsZSBub25jZQ==',
    'Sec-WebSocket-Version': '13'
  };

  const request = http.request({
    headers: headers,
    host: '127.0.0.1',
    port: wss.address().port
  });

  request.on('response', (res) => {
    console.log(`Status: ${res.statusCode}`);
    res.on('data', (chunk) => {
      console.log(`Body: ${chunk}`);
    });
  });

  request.on('error', (err) => {
    console.error('Request error:', err);
  });

  request.end();
});

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (message) => {
    console.log('Received:', message);
  });
});

wss.on('error', (err) => {
  console.error('Server error:', err);
});
