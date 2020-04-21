import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import {Game} from "./Game";
import {Field, ID, ObjectType} from "type-graphql";

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({unique: true})
  name: string;

  @CreateDateColumn({select: false})
  createdAt: string;

  @UpdateDateColumn({select: false})
  updateAt: string;

  @Field(()=> Game, {nullable: true})
  @ManyToMany(() => Game, game => game.players)
  games: Game[];
}
