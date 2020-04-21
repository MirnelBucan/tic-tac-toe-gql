import {Field, InputType} from "type-graphql";
import {IsIn, IsInt, IsLowercase, Length, Max, Min} from "class-validator";
import {Column} from "typeorm";
import {FilterInput} from "./FilterInput";

@InputType()
export class CreateGameInput extends FilterInput {
  @Field()
  @Length(1, 20)
  name: string

  @IsLowercase()
  @IsIn(['single_player', 'multiplayer'])
  @Field()
  @Column()
  type: string;
}

@InputType()
export class PlayMoveInput extends FilterInput {
  @Field()
  @IsInt()
  @Min(0)
  @Max(2)
  col: number

  @Field()
  @Min(0)
  @Max(2)
  @IsInt()
  row: number

  @Field()
  @IsInt()
  @Min(0)
  gameId: number
}

@InputType()
export class GamesSearchInput extends FilterInput {
  @Field({nullable: true})
  @IsInt()
  @Min(0)
  gameId?: number

  @Field({nullable: true})
  @IsLowercase()
  @IsIn(['active', 'pending', 'finished_win', 'finished_draw'])
  status?: string

  @Field({nullable: true})
  @IsLowercase()
  @IsIn(['single_player', 'multiplayer'])
  type?: string
}