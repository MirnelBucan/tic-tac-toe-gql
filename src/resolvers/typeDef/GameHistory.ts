import {Field, ObjectType} from "type-graphql";

@ObjectType()
class Move {
  @Field()
  col: number

  @Field()
  row: number

}

@ObjectType()
export class GameHistory {
  @Field()
  id: number;

  @Field()
  gameName: string;

  @Field()
  player: string;

  @Field()
  move: Move
}

export interface gameHistory {
  id: number;
  gameName: string;
  player: string;
  move: {
    col: number;
    row: number;
  }

}