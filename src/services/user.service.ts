import {Service} from "typedi";
import {Repository} from "typeorm";
import {InjectRepository} from "typeorm-typedi-extensions";
import {User} from '../entity/User'
import {SearchUserInput} from "../resolvers/typeDef/UserInput";

@Service()
export class UserService {
  @InjectRepository(User) private readonly userRepo: Repository<User>;

  async create(name: string): Promise<User> {
    return this.userRepo.save({name});
  }

  async findOrCreate(name: string): Promise<User> {
    const user = await this.userRepo.findOne({where: {name}});
    if (user) return user;
    return this.userRepo.save({name});
  }

  async getAll({first, skip}: SearchUserInput): Promise<User[]> {
    return this.userRepo.find({skip, take: first, relations: ['games']});
  }

  async getById(id: number): Promise<User> {
    return this.userRepo.findOneOrFail(id, {relations: ['games']});
  }

  async getByName(userName: string): Promise<User> {
    return this.userRepo.findOneOrFail({where: userName, relations: ['games']});
  }


}