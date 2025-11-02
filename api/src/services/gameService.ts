import { GameStatus } from "../utils/game/gameStatus";
import { MovementsEnum } from "../utils/game/movementsEnum";
import { GameResponses } from "../utils/responses/gameResponses";
import { ServerResponses } from "../utils/responses/serverResponses";
import { LogEnum } from "../utils/server/logEnum";
import { createLog } from "../utils/server/logger";
import { RoomService } from "./roomService";
import { Movements } from "../utils/game/movements";
import { GameModes } from "../utils/game/gameModes";
import { Themes } from "../utils/board/themesEnum";
import { MoveEmit } from "../utils/socket/gameEmits";
import { GameSocket } from "../utils/socket/gameSocket";

export const GameService = {
  startGame(
    room_id: string,
    theme: Themes,
    gamemode: GameModes,
    allowedPowers: MovementsEnum[]
  ) {
    const game = RoomService.getRoom(room_id);

    if (game === ServerResponses.NOT_FOUND) return ServerResponses.NOT_FOUND;

    if (game.timeout) clearTimeout(game.timeout);

    const players = game.players;

    if (!players) return ServerResponses.NOT_FOUND;

    if (players.length < 2) return GameResponses.NOT_ENOUGH_PLAYERS;

    game.startGame(theme, gamemode, allowedPowers);

    const first_player = Math.floor(Math.random() * 2);

    players[first_player]!.turn = 0;
    players[1 - first_player]!.turn = 1;

    game.setStatus(GameStatus.GameRunning);

    createLog(room_id, LogEnum.GAME_STARTED);

    return GameResponses.GAME_STARTED;
  },

  passTurn(room_id: string, player_id: string) {
    const game = RoomService.getRoom(room_id);

    if (game === ServerResponses.NOT_FOUND) return ServerResponses.NOT_FOUND;

    const players = game.players;

    const player = players
      .filter(Boolean)
      .find((p) => p.player_id === player_id);

    if (!player) return GameResponses.GAME_ERROR;

    player.passed++;
    game.incrementTurn();

    if (player.passed >= 3) {
      const result = RoomService.afkPlayer(room_id, player_id);
      return result;
    }

    GameSocket.passTurn(room_id);

    return GameResponses.CONTINUE;
  },

  passTurnEffect(room_id: string, player_id: string) {
    const game = RoomService.getRoom(room_id);

    if (game === ServerResponses.NOT_FOUND) return ServerResponses.NOT_FOUND;

    const players = game.players;

    const player = players
      .filter(Boolean)
      .find((p) => p.player_id === player_id);

    if (!player) return GameResponses.GAME_ERROR;

    player.decrementEffect();
    game.incrementTurn();
  },

  discardPower(room_id: string, player_id: string, powerIdx: number) {
    const room = RoomService.getRoom(room_id);

    if (room === ServerResponses.NOT_FOUND) return ServerResponses.NOT_FOUND;

    const player = room.players.find((p) => p.player_id === player_id);

    if (!player) return ServerResponses.NOT_FOUND;

    player.powers.splice(powerIdx, 1);

    GameSocket.discardPower(room_id);

    return room;
  },

  moveGame(
    room_id: string,
    player_id: string,
    movement: MovementsEnum,
    powerIndex: number | undefined,
    x?: number,
    y?: number
  ): ServerResponses.NOT_FOUND | GameResponses | MoveEmit {
    const game = RoomService.getRoom(room_id)!;

    if (game === ServerResponses.NOT_FOUND) return ServerResponses.NOT_FOUND;

    const players = game.players;
    const board = game.board!;

    const player = players
      .filter(Boolean)
      .find((p) => p.player_id === player_id)!;

    if (
      player.freeze.active &&
      movement !== MovementsEnum.UNFREEZE &&
      movement !== MovementsEnum.IMMUNITY
    ) {
      player.decrementEffect();
      game.incrementTurn();
      return GameResponses.PLAYER_FROZEN;
    }

    player.decrementEffect();
    game.incrementTurn();

    if (powerIndex !== undefined && movement !== MovementsEnum.TRAP) {
      player.powers.splice(powerIndex, 1);
    }

    switch (movement) {
      case MovementsEnum.REVEAL:
        const resultReveal = Movements.clickCell(
          board,
          x!,
          y!,
          player,
          room_id
        );

        return resultReveal;

      case MovementsEnum.BLOCK:
        createLog(
          room_id,
          `${player.nickname} ${LogEnum.BLOCKED} (${x}, ${y})`
        );

        const resultBlock = Movements.blockCell(board, x!, y!, player_id);

        return resultBlock;

      case MovementsEnum.UNBLOCK:
        createLog(
          room_id,
          `${player.nickname} ${LogEnum.UNBLOCKED} (${x}, ${y})`
        );

        const resultUnblock = Movements.unblockCell(
          board,
          x!,
          y!,
          player,
          room_id
        );

        return resultUnblock;

      case MovementsEnum.TRAP:
        createLog(
          room_id,
          `${player.nickname} ${LogEnum.TRAPPED} (${x}, ${y})`
        );

        const resultTrap = Movements.trapCell(
          board,
          x!,
          y!,
          player,
          room_id,
          powerIndex!
        );

        return resultTrap;

      case MovementsEnum.DETECT_TRAPS:
        createLog(room_id, `${player.nickname} ${LogEnum.DETECT}`);

        const resultDetect = Movements.detectTraps(board, player_id);

        return resultDetect;

      case MovementsEnum.FREEZE:
        createLog(
          room_id,
          `${player.nickname} ${LogEnum.FREEZE} ${
            players
              .filter(Boolean)
              .find((p) => p.player_id !== player.player_id)?.nickname
          }`
        );

        const resultFreeze = Movements.effectMove(
          players,
          player_id,
          MovementsEnum.FREEZE
        );

        return resultFreeze;

      case MovementsEnum.UNFREEZE:
        createLog(
          room_id,
          `${player.nickname} ${LogEnum.UNFREEZE} ${player.nickname}`
        );

        const resultUnfreeze = Movements.effectMove(
          players,
          player_id,
          MovementsEnum.UNFREEZE
        );

        return resultUnfreeze;

      case MovementsEnum.SPY:
        createLog(room_id, `${player.nickname} ${LogEnum.SPIED} (${x}, ${y})`);

        const resultSpy = Movements.spy(board, x!, y!, player_id);

        return resultSpy;

      case MovementsEnum.BLIND:
        createLog(
          room_id,
          `${player.nickname} ${LogEnum.BLINDED} ${
            players
              .filter(Boolean)
              .find((p) => p.player_id !== player.player_id)?.nickname
          }`
        );

        const resultBlind = Movements.effectMove(
          players,
          player_id,
          MovementsEnum.BLIND
        );

        return resultBlind;

      case MovementsEnum.LANTERN:
        createLog(room_id, `${player.nickname} ${LogEnum.LANTERN}`);

        const resultLantern = Movements.effectMove(
          players,
          player_id,
          MovementsEnum.LANTERN
        );

        return resultLantern;

      case MovementsEnum.IMMUNITY:
        createLog(room_id, `${player.nickname} ${LogEnum.IMMUNITY}`);

        const resultImmunity = Movements.effectMove(
          players,
          player_id,
          MovementsEnum.IMMUNITY
        );

        return resultImmunity;

      default:
        createLog(room_id, `${player.nickname} ${LogEnum.INVALID_MOVEMENT}`);

        return GameResponses.INVALID_MOVEMENT;
    }
  },
};
