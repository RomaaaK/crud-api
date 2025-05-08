import UserService from '../services/UserService';
import { RequestWrapper as Request } from '../core/RequestWrapper';
import { ResponseWrapper as Responce } from '../core/ResponseWrapper';

class UserController {
  public async getUsers(_req: Request, res: Responce): Promise<void> {
    const users = await UserService.getAllUsers();
    res.ok({ users });
  }

  public async getUserById(req: Request, res: Responce): Promise<void> {
    const userId = req.getParam('userId');
    const user = await UserService.getUserById(userId);
    res.ok({ user });
  }

  public async createUser(req: Request, res: Responce): Promise<void> {
    const user = await req.getBody();
    const createdUser = await UserService.createUser(user as object);

    res.created({ user: createdUser });
  }

  public async updateUser(req: Request, res: Responce): Promise<void> {
    const userId = req.getParam('userId');
    const updatedUser = await UserService.updateUser(
      userId,
      (await req.getBody()) as object,
    );
    res.ok({ updatedUser });
  }

  public async deleteUser(req: Request, res: Responce): Promise<void> {
    const userId = req.getParam('userId');
    await UserService.deleteUser(userId);
    res.noContent();
  }
}

export default new UserController();
