import 'dotenv/config';
import { WebServer } from './core/WebServer';
import { registerUserRoutes } from './routes/UserRoutes';
import db from './db';

const PORT = parseInt(process.env.PORT || '3000');

const server = new WebServer(PORT);

registerUserRoutes(server);

if (require.main === module) {
  db.start('DB', () => {
    server.start('Web');
  });
}

export default server;
