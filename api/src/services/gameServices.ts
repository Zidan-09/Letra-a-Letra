import { GameStatus } from "../utils/game_utils/gameStatus";
import { RevealLetter } from "../utils/requests/gameRequests";
import { GameResponses } from "../utils/responses/gameResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { RoomService } from "./roomServices";

export const GameService = {
    startGame(room_id: string) {
        const game = RoomService.getRoom(room_id);

        if (!game) return ServerResponses.NotFound;

        if (game.players.length < 2) return GameResponses.NotEnoughPlayers;
        
        const first_player = Math.floor(Math.random() * 2);

        game.players[first_player]!.turn = 0;
        game.players[1 - first_player]!.turn = 1;

        game.status = GameStatus.GameRunning;

        return GameResponses.GameStarted;
    },

    revealLetter(data: RevealLetter): ServerResponses.NotFound | GameResponses.GameError | string {
        const { room_id, player_id, x, y} = data;

        const game = RoomService.getRoom(room_id);

        if (!game) return ServerResponses.NotFound;
        if (game.status !== GameStatus.GameRunning) return GameResponses.GameError;

        const player_turn = game.players.find(p =>
            p.id === player_id
        );

        if (!player_turn || game.turn % 2 !== player_turn.turn) return GameResponses.GameError;

        const letter = game.board.revealLetter(x, y);
        game.turn++;

        return letter ? letter : GameResponses.GameError
    }
}