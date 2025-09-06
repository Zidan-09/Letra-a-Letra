import { Board } from "../entities/board";
import { GameStatus } from "../utils/game_utils/gameStatus";
import { RevealLetter } from "../utils/requests/gameRequests";
import { GameResponses } from "../utils/responses/gameResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { RoomService } from "./roomServices";

export const GameService = {
    startGame(room_id: string) {
        const game = RoomService.getRoom(room_id);
        const players = game?.getPlayers();

        if (!game || !players) return ServerResponses.NotFound;

        if (players.length < 2) return GameResponses.NotEnoughPlayers;

        const board: Board = new Board();
        game.startGame(board);
        
        const first_player = Math.floor(Math.random() * 2);

        players[first_player]!.turn = 0;
        players[1 - first_player]!.turn = 1;

        game.setStatus(GameStatus.GameRunning);

        return GameResponses.GameStarted;
    },

    revealLetter(data: RevealLetter) {
        const { room_id, player_id, x, y} = data;

        const game = RoomService.getRoom(room_id);
        const players = game?.getPlayers();
        const board = game?.getBoard();

        if (!game || !players) return ServerResponses.NotFound;
        if (game.getStatus() !== GameStatus.GameRunning) return GameResponses.GameError;

        const player_turn = players.find(p =>
            p.id === player_id
        );

        if (!player_turn || game.getTurn() % 2 !== player_turn.turn || !board) return GameResponses.GameError;

        const result = board.revealLetter(x, y);

        if (result === GameResponses.AlmostRevealed) return result;
        game.icrementTurn();

        if (typeof result === "string") return result;

        player_turn.score++;

        return {
            letter: result.letter,
            completedWord: result.completedWord,
            player_id: player_id,
            player_score: player_turn.score
        }
    }
}