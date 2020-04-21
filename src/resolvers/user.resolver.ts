import {Arg, Authorized, Ctx, Mutation, Query, Resolver} from "type-graphql";
import {Inject} from "typedi";
import {UserService} from "../services/user.service";
import {User} from "../entity/User";
import {AuthPayload} from "./typeDef/AuthPayload";
import {generateToken} from "../utils/auth";
import {IContext} from "../types/IContext";
import {SearchUserInput} from "./typeDef/UserInput";

@Resolver()
export class UserResolver {
  @Inject() userService: UserService;

  @Authorized()
  @Query(() => User)
  async me(
    @Ctx() context: IContext
  ): Promise<User> {
    return this.userService.getById(context.user!.userId);
  }

  @Authorized()
  @Query(() => User)
  async user(
    @Arg('userId') userId: number
  ): Promise<User> {
    return this.userService.getById(userId);
  }

  @Authorized()
  @Query(() => [User])
  async users(
    @Arg('data', {defaultValue: {}}) {first, skip}: SearchUserInput
  ): Promise<User[]> {
    return this.userService.getAll({first, skip});
  }

  @Mutation(() => AuthPayload)
  async createUser(
    @Arg('name') name: string,
  ): Promise<AuthPayload> {
    const user = await this.userService.findOrCreate(name);
    const token = generateToken({userId: user.id, username: user.name})

    return {
      token,
      user
    };
  }
}