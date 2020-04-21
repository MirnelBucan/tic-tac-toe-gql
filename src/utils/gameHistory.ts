import {gameHistory} from "../resolvers/typeDef/GameHistory";
import {Game} from "../entity/Game";

export const formatMessage = (game: Game | undefined): gameHistory => {
  const lastMove = game!.gameMoves.slice().pop();
  return {
    id: game!.id,
    gameName: game!.name,
    player: lastMove!.player,
    move: {
      col: lastMove!.col,
      row: lastMove!.row
    }
  }
}