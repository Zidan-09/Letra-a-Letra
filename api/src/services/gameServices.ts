import { GameStatus } from "../utils/game_utils/gameStatus";
import { MovementsEnum } from "../utils/board_utils/movementsEnum";
import { GameResponses } from "../utils/responses/gameResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { LogEnum } from "../utils/server_utils/logEnum";
import { createLog } from "../utils/server_utils/logs";
import { RoomService } from "./roomServices";
import { Movements } from "../utils/board_utils/movements";
import { Themes } from "../utils/board_utils/themesEnum";

export const GameService = {
    startGame(room_id: string, theme: Themes) {
        const game = RoomService.getRoom(room_id);
        if (!game) return ServerResponses.NotFound;
        const players = game.players;
        if (!players) return ServerResponses.NotFound;

        if (players.length < 2) return GameResponses.NotEnoughPlayers;

        game.startGame(theme);
        
        const first_player = Math.floor(Math.random() * 2);

        players[first_player]!.turn = 0;
        players[1 - first_player]!.turn = 1;

        game.setStatus(GameStatus.GameRunning);
        createLog(room_id, LogEnum.GameStarted);

        return GameResponses.GameStarted;
    },

    passTurn(room_id: string, player_id: string) {
        const game = RoomService.getRoom(room_id);
        if (!game) return ServerResponses.NotFound;
        const players = game.players;
        if (!players) return GameResponses.GameError;

        const player = players.find(p =>
            p.player_id === player_id
        )
        if (!player) return GameResponses.GameError;

        player.passed++;

        if (player.passed >= 3) {
            const result = RoomService.afkPlayer(room_id, player_id);
            return result;
        }

        return GameResponses.Continue;
    },

    moveGame(room_id: string, player_id: string, movement: MovementsEnum, x: number, y: number) {
        const game = RoomService.getRoom(room_id);
        if (!game) return ServerResponses.NotFound;
        const players = game.players;
        if (!players) return ServerResponses.NotFound;
        const board = game.board;

        if (game.status !== GameStatus.GameRunning) return GameResponses.GameError;

        const player = players.find(p =>
            p.player_id === player_id
        );

        if (!player || game.turn % 2 !== player.turn || !board) return GameResponses.GameError;
        if (player.freeze && movement !== MovementsEnum.UNFREEZE) return GameResponses.PlayerFrozen;

        game.icrementTurn();

        switch (movement) {
            case MovementsEnum.REVEAL:
                return Movements.clickCell(board, x, y, player, room_id);
            case MovementsEnum.BLOCK:
                createLog(room_id, `${player.nickname} ${LogEnum.Blocked} => x: ${x} y: ${y}`)
                return Movements.blockCell(board, x, y, player_id);
            case MovementsEnum.UNBLOCK:
                createLog(room_id, `${player.nickname} ${LogEnum.Unblocked} => x: ${x} y: ${y}`)
                return Movements.unblockCell(board, x, y, player_id);
            case MovementsEnum.TRAP:
                createLog(room_id, `${player.nickname} ${LogEnum.Trapped} => x: ${x} y: ${y}`)
                return Movements.trapCell(board, x, y, player_id);
            case MovementsEnum.DETECTTRAPS:
                createLog(room_id, `${player.nickname} ${LogEnum.Detect}`)
                return Movements.detectTraps(board, player_id);
            case MovementsEnum.FREEZE:
                createLog(room_id, `${player.nickname} ${LogEnum.Freeze} => ${players.find(p => p.player_id !== player.player_id)?.nickname}`)
                return Movements.freeze(players, player_id);
            case MovementsEnum.UNFREEZE:
                createLog(room_id, `${player.nickname} ${LogEnum.Unfreeze}`)
                return Movements.unfreeze(players, player_id);
            case MovementsEnum.SPY:
                createLog(room_id, `${player.nickname} ${LogEnum.Spied} => x: ${x} y: ${y}`)
                return Movements.spy(board, x, y, player_id);
            default:
                createLog(room_id, `${player.nickname} ${LogEnum.InvalidMovement}`)
                return GameResponses.InvalidMovement;
        }
    }
}