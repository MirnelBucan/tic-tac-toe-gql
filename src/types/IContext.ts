import {Request} from "express";
import {ITokenInfo} from "./ITokenInfo";

export interface IContext {
  req: Request;
  user: ITokenInfo | undefined
}