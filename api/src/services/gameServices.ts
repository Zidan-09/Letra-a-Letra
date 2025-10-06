import { GameStatus } from "../utils/game_utils/gameStatus";
import { MovementsEnum } from "../utils/board_utils/movementsEnum";
import { GameResponses } from "../utils/responses/gameResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { LogEnum } from "../utils/server_utils/logEnum";
import { createLog } from "../utils/server_utils/logs";
import { RoomService } from "./roomServices";
import { Movements } from "../utils/board_utils/movements";
import { Themes } from "../utils/board_utils/themesEnum";
import { GameModes } from "../utils/game_utils/gameModes";
import { MoveEmit } from "../utils/emits/gameEmits";

export const GameService = {
    startGame(room_id: string, theme: Themes, gamemode: GameModes, allowedPowers: MovementsEnum[]) {
        const game = RoomService.getRoom(room_id);

        if (
            game === ServerResponses.NotFound
        ) return ServerResponses.NotFound;

        const players = game.players;

        if (
            !players
        ) return ServerResponses.NotFound;

        if (
            players.length < 2
        ) return GameResponses.NotEnoughPlayers;

        game.startGame(theme, gamemode, allowedPowers);
        
        const first_player = Math.floor(Math.random() * 2);

        players[first_player]!.turn = 0;
        players[1 - first_player]!.turn = 1;

        game.setStatus(GameStatus.GameRunning);

        createLog(room_id, LogEnum.GameStarted);

        return GameResponses.GameStarted;
    },

    passTurn(room_id: string, player_id: string) {
        const game = RoomService.getRoom(room_id);

        if (
            game === ServerResponses.NotFound
        ) return ServerResponses.NotFound;

        const players = game.players;

        const player = players.filter(Boolean).find(p =>
            p.player_id === player_id
        )

        if (
            !player
        ) return GameResponses.GameError;

        player.passed++;
        game.incrementTurn();

        if (
            player.passed >= 3
        ) {
            const result = RoomService.afkPlayer(room_id, player_id);
            return result;
        }

        return GameResponses.Continue;
    },

    moveGame(
        room_id: string, 
        player_id: string, 
        movement: MovementsEnum, 
        powerIndex: number | undefined, 
        x: number, 
        y: number
    ): ServerResponses.NotFound | GameResponses | [number | undefined, MoveEmit] {
        const game = RoomService.getRoom(room_id)!;

        if (
            game === ServerResponses.NotFound
        ) return ServerResponses.NotFound;
        
        const players = game.players;
        const board = game.board!;

        const player = players.filter(Boolean).find(p =>
            p.player_id === player_id
        )!;

        if (
            player.freeze.active && 
            movement !== MovementsEnum.UNFREEZE
        ) return GameResponses.PlayerFrozen;

        game.incrementTurn();

        if (powerIndex) {
            player.powers.splice(powerIndex, 1);
        }

        player.decrementEffect();

        switch (movement) {
            case MovementsEnum.REVEAL:
                const resultReveal = Movements.clickCell(
                    board,
                    x,
                    y,
                    player,
                    room_id
                )
                
                return typeof resultReveal !== "string" ? [powerIndex, resultReveal] : resultReveal;
                
            case MovementsEnum.BLOCK:
                createLog(room_id, `${player.nickname} ${LogEnum.Blocked} (${x}, ${y})`);

                const resultBlock = Movements.blockCell(
                    board,
                    x,
                    y,
                    player_id
                );

                return typeof resultBlock !== "string" ? [powerIndex, resultBlock] : resultBlock;

            case MovementsEnum.UNBLOCK:
                createLog(room_id, `${player.nickname} ${LogEnum.Unblocked} (${x}, ${y})`);

                const resultUnblock = Movements.unblockCell(
                    board,
                    x,
                    y,
                    player_id
                );

                return typeof resultUnblock !== "string" ? [powerIndex, resultUnblock] : resultUnblock; 

            case MovementsEnum.TRAP:
                createLog(room_id, `${player.nickname} ${LogEnum.Trapped} (${x}, ${y})`);

                const resultTrap = Movements.trapCell(
                    board, 
                    x, 
                    y, 
                    player_id
                );

                return typeof resultTrap !== "string" ? [powerIndex, resultTrap] : resultTrap;

            case MovementsEnum.DETECT_TRAPS:
                createLog(room_id, `${player.nickname} ${LogEnum.Detect}`);

                const resultDetect = Movements.detectTraps(
                    board, 
                    player_id
                );

                return typeof resultDetect !== "string" ? [powerIndex, resultDetect] : resultDetect;

            case MovementsEnum.FREEZE:
                createLog(room_id, `${player.nickname} ${LogEnum.Freeze} ${players.filter(Boolean).find(p => p.player_id !== player.player_id)?.nickname}`);

                const resultFreeze = Movements.effectMove(
                    players, 
                    player_id, 
                    MovementsEnum.FREEZE
                );

                return typeof resultFreeze !== "string" ? [powerIndex, resultFreeze] : resultFreeze;

            case MovementsEnum.UNFREEZE:
                createLog(room_id, `${player.nickname} ${LogEnum.Unfreeze} ${player.nickname}`);

                const resultUnfreeze = Movements.effectMove(
                    players, 
                    player_id, 
                    MovementsEnum.UNFREEZE
                );

            case MovementsEnum.SPY:
                createLog(room_id, `${player.nickname} ${LogEnum.Spied} (${x}, ${y})`);

                const resultSpy = Movements.spy(
                    board, 
                    x, 
                    y, 
                    player_id
                );

                return typeof resultSpy !== "string" ? [powerIndex, resultSpy] : resultSpy;

            case MovementsEnum.BLIND:
                createLog(room_id, `${player.nickname} ${LogEnum.Blinded} ${players.filter(Boolean).find(p => p.player_id !== player.player_id)?.nickname}`);
                
                const resultBlind = Movements.effectMove(
                    players, 
                    player_id, 
                    MovementsEnum.BLIND
                );

            case MovementsEnum.LANTERN:
                createLog(room_id, `${player.nickname} ${LogEnum.Lantern}`);

                const resultLantern = Movements.effectMove(
                    players, 
                    player_id, 
                    MovementsEnum.LANTERN
                );

                return typeof resultLantern !== "string" ? [powerIndex, resultLantern] : resultLantern;

            case MovementsEnum.IMMUNITY:
                createLog(room_id, `${player.nickname} ${LogEnum.Immunity}`);

                const resultImmunity = Movements.effectMove(
                    players, 
                    player_id, 
                    MovementsEnum.IMMUNITY
                );

                return typeof resultImmunity !== "string" ? [powerIndex, resultImmunity] : resultImmunity;

            default:
                createLog(room_id, `${player.nickname} ${LogEnum.InvalidMovement}`);

                return GameResponses.InvalidMovement;
        }
    }
};