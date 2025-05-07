import 'dotenv/config';
import { WebServer } from './core/WebServer';
import { registerUserRoutes } from './routes/users.router';

const PORT = parseInt(process.env.PORT || '3000', 10);

const server = new WebServer(PORT);

// server.addRoute(HTTP_METHODS.GET, '/{id}', (_req, res, params) => {
//   const id = params?.id;
//   res.ok({ message: `User ID: ${id}` });
// });
registerUserRoutes(server);

server.start();
