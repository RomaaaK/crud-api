import UserService from '../services/UserService';
import { RequestWrapper as Request } from '../core/RequestWrapper';
import { ResponseWrapper as Response } from '../core/ResponseWrapper';
import { User } from '../models/UserModel';

class UserController {
  public async getUsers(_req: Request, res: Response): Promise<void> {
    const users = await UserService.getAllUsers();
    res.ok({ users });
  }

  public async getUserById(req: Request, res: Response): Promise<void> {
    const userId = req.getParam('userId');
    const user = await UserService.getUserById(userId);
    res.ok({ user });
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    const user = await req.getBody<Omit<User, 'id'>>();
    const createdUser = await UserService.createUser(user);

    res.created({ user: createdUser });
  }

  public async updateUser(req: Request, res: Response): Promise<void> {
    const userId = req.getParam('userId');
    const updatedUser = await UserService.updateUser(
      userId,
      await req.getBody<Partial<Omit<User, 'id'>>>(),
    );
    res.ok({ user: updatedUser });
  }

  public async deleteUser(req: Request, res: Response): Promise<void> {
    const userId = req.getParam('userId');
    await UserService.deleteUser(userId);
    res.noContent();
  }
}

export default new UserController();
