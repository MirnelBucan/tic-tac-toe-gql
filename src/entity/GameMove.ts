import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Game} from "./Game";
import {Field, ID, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class GameMove {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  row: number;

  @Field()
  @Column()
  col: number;

  @Field()
  @Column()
  player: string;

  @CreateDateColumn({select: false})
  createdAt: string;

  @UpdateDateColumn({select: false})
  updateAt: string;

  @Field(()=> Game)
  @ManyToOne( () => Game, game=>game.gameMoves)
  game: Game;
}
