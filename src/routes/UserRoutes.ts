import UserController from '../controllers/UserController';
import { Router } from '../core/Router';
import { WebServer } from '../core/WebServer';

export function registerUserRoutes(server: WebServer) {
  const router = new Router(server);
  router.setPrefix('/api/users');

  router.get('', UserController.getUsers);
  router.get('/{userId}', UserController.getUserById);

  router.post('', UserController.createUser);

  router.put('/{userId}', UserController.updateUser);

  router.delete('/{userId}', UserController.deleteUser);
}
