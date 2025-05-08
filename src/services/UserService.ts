import UserRepository from '../storage/UserRepository';
import { User } from '../models/UserModel';
import { NotFoundError } from '../errors/NotFoundError';
import { BedRequestError } from '../errors/BadRequestError';
import { validate } from 'uuid';
import { v4 as uuidv4 } from 'uuid';

class UserService {
  public async getAllUsers(): Promise<User[]> {
    return UserRepository.findAll();
  }

  public async getUserById(id: string): Promise<User> {
    if (!validate(id)) {
      throw new BedRequestError(`Invalid UUID: ${id}`);
    }
    const user = UserRepository.findById(id);
    if (!user) throw new NotFoundError(`User with ID ${id} not found`);
    return user;
  }

  public async createUser(data: object): Promise<User> {
    const user = data as Omit<User, 'id'>;
    this.validateRequiredFields({ id: '', ...user }, [
      'username',
      'age',
      'hobbies',
    ]);
    const createdUser = { id: uuidv4(), ...user };
    UserRepository.save(createdUser);
    return createdUser;
  }

  public async updateUser(id: string, userData: object): Promise<User> {
    if (!validate(id)) {
      throw new BedRequestError(`Invalid UUID: ${id}`);
    }

    const currentUser = await this.getUserById(id);

    const { username, age, hobbies } = userData as Partial<Omit<User, 'id'>>;

    const updateData: Omit<User, 'id'> = {
      username: username ?? currentUser.username,
      age: age ?? currentUser.age,
      hobbies: hobbies ?? currentUser.hobbies,
    };

    return UserRepository.update(id, updateData);
  }

  public async deleteUser(id: string): Promise<void> {
    if (!validate(id)) {
      throw new BedRequestError(`Invalid UUID: ${id}`);
    }

    await this.getUserById(id);

    UserRepository.deleteById(id);
  }

  private validateRequiredFields(user: User, fields: (keyof User)[]): void {
    const requiredFields: (keyof User)[] = fields;
    for (const field of requiredFields) {
      if (user[field] === undefined || user[field] === null) {
        throw new BedRequestError(`Field '${field}' is required`);
      }
    }
  }
}

export default new UserService();
