import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { NavigateFunction } from "react-router-dom";
import type { Socket } from "socket.io-client";
import type {
  CellKeys,
  CellUpdate,
  Game,
  Player,
} from "../../utils/room_utils";

export function useInitializeGame(
  socket: Socket,
  navigate: NavigateFunction,
  setRoom: Dispatch<SetStateAction<Game | undefined>>,
  setWords: Dispatch<SetStateAction<string[] | undefined>>,
  setTimer: Dispatch<SetStateAction<number | undefined>>,
  setP1: Dispatch<SetStateAction<Player | undefined>>,
  setP2: Dispatch<SetStateAction<Player | undefined>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setCells: Dispatch<SetStateAction<Record<CellKeys, CellUpdate>>>
) {
  useEffect(() => {
    if (!socket || !socket.id) return;

    const game = localStorage.getItem("game");
    const actual = localStorage.getItem("actual");
    const wordsData = localStorage.getItem("words");

    if (!game || !wordsData) {
      navigate("/");
      return;
    }

    const data: Game = JSON.parse(game);
    const wordsParsed: string[] = JSON.parse(wordsData);

    const me = [...data.players, ...data.spectators]
      .filter(Boolean)
      .find((p) => p.player_id === socket.id);

    const p1Data = data.players[0];
    const p2Data = data.players[1];

    if (!me || !p1Data || !p2Data || !wordsParsed) {
      navigate("/");
      return;
    }

    setRoom(data);
    setWords(wordsParsed);
    setTimer(data.timer);

    if (me.spectator) {
      setP1(p1Data);
      setP2(p2Data);
      setLoading(false);

      setCells((prev) => {
        const copy = { ...prev };
        if (!actual) return copy;

        const cells: { letter: string; x: number; y: number; by: string }[] =
          JSON.parse(actual);

        cells.forEach((cell) => {
          const key = `${cell.x}-${cell.y}` as CellKeys;
          copy[key] = {
            ...copy[key],
            letter: cell.letter,
            actor: cell.by,
            revealed: true,
          };
        });

        return copy;
      });

      return;
    }

    setP1(me);
    const opponent = data.players.find((p) => p.player_id !== me.player_id);
    setP2(opponent);

    setLoading(false);
  }, [socket, navigate]);
}
