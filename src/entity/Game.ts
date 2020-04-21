import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

import {Field, ID, ObjectType} from "type-graphql";
import {User} from "./User";
import {GameMove} from "./GameMove";

@ObjectType()
@Entity()
export class Game {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({unique: true})
  name: string;

  @Field()
  @Column({default: 'pending'})
  status: string;

  @Field()
  @Column()
  type: string;

  @CreateDateColumn({select: false})
  createdAt: string;

  @UpdateDateColumn({select: false})
  updateAt: string;

  @Field(() => User, {nullable: true})
  @ManyToMany(() => User, player => player.games)
  @JoinTable()
  players: User[];

  @Field(() => GameMove, {nullable: true})
  @OneToMany(() => GameMove, gameMove => gameMove.game, {cascade: true})
  gameMoves: GameMove[]
}
