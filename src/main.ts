import 'dotenv/config';
import { WebServer } from './core/server';

const PORT = parseInt(process.env.PORT || '3000', 10);

const server = new WebServer(PORT);

server.addRoute('GET', '/', (_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok' }));
});

server.start();
