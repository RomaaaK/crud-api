import { User } from '../models/User';
import { BaseRepository } from './BaseRepository';

class UserRepository extends BaseRepository<User> {}

export default new UserRepository();
