import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  PubSub,
  Query,
  Resolver,
  ResolverFilterData,
  Root,
  Subscription
} from "type-graphql";
import {Inject} from "typedi";
import {GameService} from "../services/game.service";
import {Game} from "../entity/Game";
import {IContext} from "../types/IContext";
import {PubSubEngine} from "graphql-subscriptions";
import {CreateGameInput, GamesSearchInput, PlayMoveInput} from "./typeDef/GameInput";
import {formatMessage} from "../utils/gameHistory";
import {GameHistory} from "./typeDef/GameHistory";

@Resolver()
export class GameResolver {
  @Inject() gameService: GameService;

  @Query(() => [Game])
  async games(
    @Arg('data', {nullable: true, defaultValue: {}}) data: GamesSearchInput
  ): Promise<Game[]> {
    return this.gameService.getAll(data);
  }

  @Authorized()
  @Query(() => Game)
  async game(
    @Arg('gameId') gameId: number
  ): Promise<Game> {
    return this.gameService.get(gameId);
  }

  @Authorized()
  @Mutation(() => Game)
  async createGame(
    @Arg('data') {name, type}: CreateGameInput,
    @Ctx() {user}: IContext
  ): Promise<Game> {
    const {userId} = user!;
    return this.gameService.create(name, type, userId);
  }

  @Authorized()
  @Mutation(() => Game)
  async joinGame(
    @Arg('gameId') gameId: number,
    @Ctx() {user}: IContext
  ): Promise<Game> {
    const {userId} = user!;
    return this.gameService.join(gameId, userId);
  }

  @Authorized()
  @Mutation(() => Game)
  async playMove(
    @Arg('data') {gameId, col, row}: PlayMoveInput,
    @Ctx() {user}: IContext,
    @PubSub() pubSub: PubSubEngine,
  ): Promise<Game | undefined> {
    const {userId} = user!;
    const game = await this.gameService.playMove(gameId, col, row, userId);
    const gameHistoryPayload = formatMessage(game);

    await pubSub.publish("LIVE_HISTORY", gameHistoryPayload);
    await pubSub.publish("GAME_UPDATE", game);

    if (game.type === 'single_player' && game.status === 'active') {
      const gameAfterBot = await this.gameService.botMove(game);
      const gameAfterBotPayload = formatMessage(gameAfterBot);
      await pubSub.publish("LIVE_HISTORY", gameAfterBotPayload);
      await pubSub.publish("GAME_UPDATE", gameAfterBot);
    }

    return game;
  }

  @Subscription({
    topics: "LIVE_HISTORY",
    filter: ({payload, args}: ResolverFilterData<GameHistory>) => payload.id === args.gameId
  })
  gameHistory(
    @Root() payload: GameHistory,
    //@ts-ignore
    @Arg('gameId') gameId: number
  ): GameHistory {
    return payload
  }

  @Subscription({
    topics: "GAME_UPDATE",
    filter: ({payload, args}: ResolverFilterData<Game>) => payload.id === args.gameId
  })
  gameUpdate(
    @Root() payload: Game,
    //@ts-ignore
    @Arg('gameId') gameId: number
  ): Game {
    return payload
  }
}