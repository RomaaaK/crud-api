import DBController from '../controllers/DBController';
import { Router } from '../core/Router';
import { WebServer } from '../core/WebServer';

export function registerDbRoutes(server: WebServer) {
  const router = new Router(server);
  router.setPrefix('/api/db');

  router.get('', DBController.getAllData);
  router.get('/{id}', DBController.getByIdData);

  router.post('', DBController.addData);

  router.put('/{id}', DBController.update);

  router.delete('/{id}', DBController.delete);
}
