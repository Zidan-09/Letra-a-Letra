import {
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from "react";
import type { Socket } from "socket.io-client";
import type {
  CellKeys,
  CellUpdate,
  CompletedWord,
  Game,
  GameData,
  NullPlayer,
  Player,
} from "../../utils/room_utils";
import type { NavigateFunction } from "react-router-dom";
import { MovementHandlers } from "./movement/movementHandlers";

export function useSocketHandlers(
  socket: Socket,
  setTurn: Dispatch<SetStateAction<number>>,
  setP1: Dispatch<SetStateAction<Player | undefined>>,
  setP2: Dispatch<SetStateAction<Player | undefined>>,
  turnStartRef: RefObject<number>,
  setCells: Dispatch<SetStateAction<Record<CellKeys, CellUpdate>>>,
  spyTimers: RefObject<Map<string, number>>,
  setFindeds: Dispatch<SetStateAction<CompletedWord[]>>,
  setHidedLetters: Dispatch<SetStateAction<CellUpdate[]>>,
  setHidedWords: Dispatch<
    SetStateAction<
      { finded_by: string; finded: string; positions: [number, number][] }[]
    >
  >,
  setRoom: Dispatch<SetStateAction<Game | undefined>>,
  navigate: NavigateFunction,
  setWinner: Dispatch<SetStateAction<Player | NullPlayer | undefined>>
) {
  useEffect(() => {
    if (!socket) return;

    socket.on(
      "movement",
      ({ player_id, movement, data, players, turn }: GameData) => {
        MovementHandlers(
          setTurn,
          turn,
          turnStartRef,
          setP1,
          setP2,
          players,
          setCells,
          data,
          spyTimers,
          movement,
          player_id,
          setFindeds,
          setHidedLetters,
          setHidedWords
        );
      }
    );

    socket.on("player_left", (updatedRoom: Game) => {
      setRoom({
        ...updatedRoom,
        players: [...updatedRoom.players],
        spectators: [...updatedRoom.spectators],
      });
    });

    socket.on("pass_turn", ({ turn }) => {
      setTurn(turn);
      turnStartRef.current = Date.now();
    });

    socket.on("discard_power", (updatedRoom: Game) => {
      setP1((prev) => {
        if (!prev) return prev;

        const copy = { ...prev };
        const player = updatedRoom.players.find(
          (p) => p.player_id === copy.player_id
        );

        if (!player) return prev;

        return player;
      });

      setP2((prev) => {
        if (!prev) return prev;

        const copy = { ...prev };
        const player = updatedRoom.players.find(
          (p) => p.player_id === copy.player_id
        );

        if (!player) return prev;

        return player;
      });
    });

    socket.on("afk", (player_id) => {
      alert("Você foi desconectado por inatividade");
      if (socket.id === player_id) navigate("/room");
    });

    socket.on("game_over", ({ winner, room }) => {
      if (room) localStorage.setItem("game", JSON.stringify(room));

      setWinner(winner);
    });

    return () => {
      socket.off("movement");
      socket.off("player_left");
      socket.off("pass_turn");
      socket.off("discard_power");
      socket.off("afk");
      socket.off("game_over");
      spyTimers.current.forEach((timer) => clearTimeout(timer));
      spyTimers.current.clear();
    };
  }, [socket, setP1, setP2, setCells, setFindeds]);
}
