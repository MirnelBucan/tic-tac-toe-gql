import {Service,} from "typedi";
import {Game} from "../entity/Game";
import {Repository} from "typeorm";
import {InjectRepository} from "typeorm-typedi-extensions";
import {User} from "../entity/User";
import {GameMove} from "../entity/GameMove";
import {UserInputError} from 'apollo-server-express'
import {GamesSearchInput} from "../resolvers/typeDef/GameInput";
import {_formatCondition} from "../utils/formatDbCondition";

@Service()
export class GameService {

  @InjectRepository(Game) private readonly gameRepo: Repository<Game>;
  @InjectRepository(User) private readonly userRepo: Repository<User>;
  @InjectRepository(GameMove) private readonly gameMoveRepo: Repository<GameMove>;

  async create(name: string, type: string, playerId: number): Promise<Game> {
    const player = await this.userRepo.findOneOrFail(playerId);
    const status = type === 'multiplayer' ? 'pending' : 'active';
    const game = this.gameRepo.create({name, type, status});
    game.players ? game.players.push(player) : game.players = [player];
    return this.gameRepo.save(game)
  }

  //@ts-ignore
  async getAll({status, type, first, skip}: GamesSearchInput): Promise<Game[]> {
    const where = _formatCondition({status, type});
    console.log(where);
    return this.gameRepo.find({where, skip, take: first, relations: ['players', 'gameMoves']});
  }

  async get(id: number): Promise<Game> {
    return this.gameRepo.findOneOrFail(id, {relations: ['players', 'gameMoves']});
  }

  async join(id: number, player: number): Promise<Game> {
    const game = await this.gameRepo.findOneOrFail(id, {relations: ['players', 'gameMoves']});
    if (game.players.length === 2) {
      throw new UserInputError('Game is full!');
    }
    if (game.type === 'single_player') {
      throw new UserInputError('Unable to join single player game!');
    }
    const user = await this.userRepo.findOneOrFail(player);
    game.players.push(user);
    game.status = 'active';
    return this.gameRepo.save(game);
  }

  async playMove(id: number, col: number, row: number, player: number | undefined = undefined): Promise<Game> {
    const game = await this.gameRepo.findOneOrFail(id, {relations: ['players', 'gameMoves']});

    let currPlayerName = 'BOT';

    if (player) {
      const user = game.players.find(gamePlayer => gamePlayer.id === player);
      currPlayerName = user!.name;
    }

    this._checkGameStatus(game.status)

    if (!this._isPlayersTurn(currPlayerName, game.gameMoves)) {
      throw new UserInputError('Not valid turn!');
    }

    if (this._verifyMove(col, row, game.gameMoves)) {
      throw new UserInputError(`Invalid move (${row}, ${col})!`)
    }

    const gameMove = await this.gameMoveRepo.create({col, row, player: currPlayerName});
    game.gameMoves.push(gameMove)
    if (game.gameMoves.length === 9) {
      game.status = 'finished_draw';
    } else if (this._checkWinner(game.gameMoves)) {
      game.status = 'finished_win'
    }
    return this.gameRepo.save(game);
  }

  public async botMove(game: Game): Promise<Game> {
    const gameMoves = game.gameMoves.slice();
    const {col, row} = this._generateBotMove(gameMoves);
    return this.playMove(game.id, col, row);
  }

  private _generateBotMove(gameMoves: GameMove[]): { col: number, row: number } {
    const board = this._generateBoard(gameMoves);
    const possibleMoves = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if(board[i][j] === ''){
        possibleMoves.push({col: j, row: i})
        }
      }
    }

    const randMove = Math.floor(Math.random() * possibleMoves.length)
    return {
      col: possibleMoves[randMove].col,
      row: possibleMoves[randMove].row
    }
  }

  private _verifyMove(col: number, row: number, gameMoves: GameMove[]): boolean {
    if (this._boardOutOfBound(col, row)) {
      return false;
    }

    const notValid = gameMoves.find((item) => {
      return item.col === col && item.row === row
    })
    return Boolean(notValid);
  }

  //Private helper methods
  private _isPlayersTurn(name: string, gameMoves: GameMove[]): boolean {
    const lastMove = gameMoves[gameMoves.length - 1];
    if (!lastMove) return true;
    return name !== lastMove!.player
  }

  private _generateBoard(gameMoves: GameMove[]): Array<string[]> {
    let arr = [['', '', ''], ['', '', ''], ['', '', '']];
    let symbol = 'X';
    gameMoves.forEach((item) => {
      console.log(item)
      console.log(symbol)
      arr[item.col][item.row] = symbol;
      symbol = symbol === 'X' ? 'O' : 'X';
    })
    return arr;
  }

  private _boardOutOfBound(col: number, row: number): boolean {
    return col < 0 || row < 0 || col > 2 || row > 2;
  }

  private _checkWinner(gameMoves: GameMove[]): boolean {
    const board = this._generateBoard(gameMoves);
    console.log(board);
    //check diagonal
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
      return true;
    }
    //check reverse diagonal
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
      return true;
    }
    //check rows & cols
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== '') {
        return true;
      }
      if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== '') {
        return true;
      }
    }
    return false;

  }

  private _checkGameStatus(status: string): void {
    switch (status) {
      case 'pending':
        throw new UserInputError('No other player!');
      case 'finished_win':
      case'finished_draw':
        throw new UserInputError('Unable to play, game already finished!');
    }
  }

}