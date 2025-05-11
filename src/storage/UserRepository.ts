import { User } from '../models/UserModel';
import { BaseRepository } from './BaseRepository';

class UserRepository extends BaseRepository<User> {}

export default new UserRepository();
