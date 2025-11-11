import { useEffect } from "react";
import type { Game, Player } from "../../utils/room_utils";
import { PassTurn } from "../../utils/passTurn";

export const PassTurnHook = {
  useAutoPassTurn(
    room: Game | undefined,
    p1: Player | undefined,
    timer: number | undefined,
    turn: number
  ) {
    useEffect(() => {
      if (!room || !p1 || !timer) return;

      const isMyTurn =
        turn % 2 === p1.turn || (turn === 0 && turn % 2 === p1.turn);

      if (!isMyTurn) return;

      const timeout = setTimeout(() => {
        PassTurn.passTurnTimer(p1, room.room_id);
      }, timer * 1000);

      return () => clearTimeout(timeout);
    }, [room, p1, turn]);
  },

  useAutoEffectPassTurn(
    room: Game | undefined,
    p1: Player | undefined,
    turn: number
  ) {
    useEffect(() => {
      if (!room || !p1) return;

      if (turn % 2 !== p1.turn) return;

      PassTurn.passTurnEffect(p1, room.room_id);
    }, [turn]);
  },
};
