import { Router } from '../core/Router';
import { WebServer } from '../core/WebServer';

export function registerUserRoutes(server: WebServer) {
  const router = new Router(server);

  router.get('/', (_req, res) => {
    res.ok({ message: 'ok' });
  });

  router.get('/{id}', (req, res) => {
    const id = req.getParam('id');
    res.ok({ message: `User ID: ${id}` });
  });
}
