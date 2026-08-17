const http = require('http');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'OK', service: 'clinical-ws-presence' }));
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log(`[Presence WS] New reviewer connection established.`);

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      // Broadcast heartbeat presence to all active reviewers
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'PRESENCE_UPDATE', payload: data }));
        }
      });
    } catch (e) {
      console.error('[Presence WS] Malformed packet:', e);
    }
  });

  ws.send(JSON.stringify({ type: 'INIT_ACK', timestamp: new Date().toISOString() }));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`[Presence WS] Node.js WebSocket Presence Engine listening on :${PORT}`);
});
