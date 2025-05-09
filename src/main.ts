import 'dotenv/config';
import { WebServer } from './core/WebServer';
import { registerUserRoutes } from './routes/UserRoutes';

const PORT = parseInt(process.env.PORT || '3000');

const server = new WebServer(PORT);

registerUserRoutes(server);

if (require.main === module) {
  server.start();
}

export default server;
