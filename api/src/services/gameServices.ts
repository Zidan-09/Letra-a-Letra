import { Board } from "../entities/board";
import { GameStatus } from "../utils/game_utils/gameStatus";
import { RevealLetter } from "../utils/requests/gameRequests";
import { GameResponses } from "../utils/responses/gameResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { LogEnum } from "../utils/server_utils/logEnum";
import { createLog } from "../utils/server_utils/logs";
import { RoomService } from "./roomServices";

export const GameService = {
    startGame(room_id: string) {
        const game = RoomService.getRoom(room_id);
        if (!game) return ServerResponses.NotFound;
        const players = game?.getPlayers();
        if (!players) return ServerResponses.NotFound;

        if (players.length < 2) return GameResponses.NotEnoughPlayers;

        const board: Board = new Board();
        game.startGame(board);
        
        const first_player = Math.floor(Math.random() * 2);

        players[first_player]!.turn = 0;
        players[1 - first_player]!.turn = 1;

        game.setStatus(GameStatus.GameRunning);
        createLog(room_id, LogEnum.GameStarted);

        return GameResponses.GameStarted;
    },

    revealLetter(data: RevealLetter) {
        const { room_id, player_id, x, y} = data;

        const game = RoomService.getRoom(room_id);
        if (!game) return ServerResponses.NotFound;
        const players = game.getPlayers();
        if (!players) return ServerResponses.NotFound;
        const board = game.getBoard();

        if (game.getStatus() !== GameStatus.GameRunning) return GameResponses.GameError;

        const player_turn = players.find(p =>
            p.id === player_id
        );

        if (!player_turn || game.getTurn() % 2 !== player_turn.turn || !board) return GameResponses.GameError;

        const result = board.revealLetter(x, y);

        if (result === GameResponses.AlmostRevealed) {
            createLog(room_id, `${player_turn.nickname} ${LogEnum.PlayerReveal} ${x} ${y} => ${result} score: ${player_turn.score}`);
            return result
        };
        game.icrementTurn();
        player_turn.passed = 0;

        if (typeof result === "string") {
            createLog(room_id, `${player_turn.nickname} ${LogEnum.PlayerReveal} ${x} ${y} => ${result} score: ${player_turn.score}`);
            return result;
        };

        player_turn.score++;

        createLog(room_id, `${player_turn.nickname} ${LogEnum.PlayerReveal} ${x} ${y} => ${result.letter} score: ${player_turn.score}`);

        return {
            letter: result.letter,
            completedWord: result.completedWord,
            player_id: player_id,
            player_score: player_turn.score
        }
    },

    passTurn(room_id: string, player_id: string) {
        const game = RoomService.getRoom(room_id);
        if (!game) return ServerResponses.NotFound;
        const players = game.getPlayers();
        if (!players) return GameResponses.GameError;

        const player = players.find(p =>
            p.id === player_id
        )
        if (!player) return GameResponses.GameError;

        player.passed++;

        if (player.passed >= 3) {
            const result = RoomService.afkPlayer(room_id, player_id);
            return result;
        }

        return GameResponses.Continue;
    }
}