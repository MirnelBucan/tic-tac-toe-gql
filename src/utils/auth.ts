import {AuthChecker} from "type-graphql";
import {IContext} from "../types/IContext";
import {ITokenInfo} from "../types/ITokenInfo";
import jwt from 'jsonwebtoken';
import {getRepository} from "typeorm";
import {User} from "../entity/User";

export const authChecker: AuthChecker<IContext> = async (
  //@ts-ignore
  {root, args, context: {user}, info}, roles) => {
  const validUser = await getRepository(User).findOne(user!.userId);
  return !!validUser;
};

export const generateToken = (tokenInfo: ITokenInfo): string => {
  return jwt.sign(tokenInfo, process.env.APP_SECRET || 'some_really_cool_secret_:D');
}
