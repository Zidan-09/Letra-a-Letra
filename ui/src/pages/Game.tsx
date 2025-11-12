import { useState, useRef } from "react";
import { useSocket } from "../services/socketProvider";
import { useNavigate } from "react-router-dom";
import settings from "../settings.json";
import type {Game, Player, MovementsEnum, CompletedWord, CellKeys, CellUpdate, NullPlayer,} from "../utils/room_utils";
import { useInitializeGame } from "../hooks/Game/useInitializeGame";
import PlayerCard from "../components/Game/PlayerCard";
import Slots from "../components/Game/Slots";
import Board from "../components/Game/Board";
import ExtraButtons from "../components/Game/ExtraButtons";
import Words from "../components/Game/Words";
import EffectOverlay from "../components/Game/EffectOverlay";
import WinnerOverlay from "../components/Game/WinnerOverlay";
import Loading from "../components/Loading";
import logo from "../assets/logo.svg";
import iconSwitch from "../assets/buttons/eye-svgrepo-com.svg";
import styles from "../styles/Game.module.css";
import { PassTurnHook } from "../hooks/Game/useTurnSystem";
import { useHiddenSystem } from "../hooks/Game/useHiddenSystem";
import { useSocketHandlers } from "../hooks/Game/useSocketHandlers";

export default function Game() {
  const [room, setRoom] = useState<Game>();
  const [p1, setP1] = useState<Player>();
  const [p2, setP2] = useState<Player>();
  const [cells, setCells] = useState<Record<CellKeys, CellUpdate>>({});
  const [turn, setTurn] = useState<number>(0);
  const [timer, setTimer] = useState<number>();
  const [viewFlipped, setViewFlipped] = useState<boolean>(false);
  const turnStartRef = useRef<number>(Date.now());
  const [hidedLetters, setHidedLetters] = useState<CellUpdate[]>([]);
  const [hidedWords, setHidedWords] = useState<
    { finded_by: string; finded: string; positions: [number, number][] }[]
  >([]);
  const [words, setWords] = useState<string[]>();
  const [findeds, setFindeds] = useState<CompletedWord[]>([]);
  const [move, setMove] = useState<MovementsEnum>("REVEAL");
  const [moveIdx, setMoveIdx] = useState<number | undefined>(undefined);
  const [winner, setWinner] = useState<Player | NullPlayer | undefined>(
    undefined
  );
  const [isChatOpen, setChatOpen] = useState<boolean>(false);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const spyTimers = useRef<Map<string, number>>(new Map());

  const socket = useSocket();
  const navigate = useNavigate();

  useInitializeGame(
    socket,
    navigate,
    setRoom,
    setWords,
    setTimer,
    setP1,
    setP2,
    setLoading,
    setCells
  );

  PassTurnHook.useAutoPassTurn(room, p1, timer, turn);

  PassTurnHook.useAutoEffectPassTurn(room, p1, turn);

  useHiddenSystem(
    room,
    p1,
    hidedLetters,
    hidedWords,
    setCells,
    setHidedLetters,
    setHidedWords
  );

  useSocketHandlers(
    socket,
    setTurn,
    setP1,
    setP2,
    turnStartRef,
    setCells,
    spyTimers,
    setFindeds,
    setHidedLetters,
    setHidedWords,
    setRoom,
    navigate,
    setWinner
  );

  const handleMovement = async (x?: number, y?: number) => {
    try {
      const res = await fetch(`${settings.server}/game/${room?.room_id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_id: socket.id,
          movement: move,
          powerIndex: moveIdx,
          x: x,
          y: y,
        }),
      })
        .then((res) => res.json())
        .then((data) => data);

      if (!res.success) console.warn(res);
    } catch (err) {
      console.error(err);
    }

    setMove("REVEAL");
    setMoveIdx(undefined);
  };

  const handleDiscard = async () => {
    try {
      const res = await fetch(
        `${settings.server}/game/${room?.room_id}/discard`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            player_id: socket.id,
            power: move,
            powerIdx: moveIdx,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => data);

      if (!res.success) console.warn(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChat = () => {
    setChatOpen(true);
    setUnreadMessages(0);
  };

  const handleNewMessage = () => {
    if (!isChatOpen) setUnreadMessages((prev) => prev + 1);
  };

  const handleFlipView = () => {
    if (p1?.player_id === socket.id) return;

    setViewFlipped((prev) => !prev);
  };

  if (loading || !p1 || !p2 || !words) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <PlayerCard
          id={0}
          player={viewFlipped ? p2 : p1}
          timer={timer}
          turn={turn}
          turnStart={turnStartRef.current}
        />

        <img src={logo} alt="Logo" className={styles.logo} />

        <PlayerCard
          id={1}
          player={viewFlipped ? p1 : p2}
          timer={timer}
          turn={turn}
          turnStart={turnStartRef.current}
        />
      </div>

      <div className={styles.game}>
        {p1.player_id === socket.id ? (
          <Slots
            playerPowers={p1.powers}
            selected={moveIdx}
            selectMove={setMove}
            selectMoveIdx={setMoveIdx}
            applyEffect={handleMovement}
            discardPower={handleDiscard}
          />
        ) : (
          <div />
        )}

        <Board
          p1={p1}
          turn={turn}
          cellsData={cells}
          hideds={hidedLetters}
          move={move}
          moveIdx={moveIdx}
          onCellClick={p1.player_id === socket.id ? handleMovement : undefined}
        />

        <Words words={words} findeds={findeds} />
      </div>

      {room && (
        <ExtraButtons
          room_id={room.room_id}
          nickname={
            [...room.players, ...room.spectators]
              .filter(Boolean)
              .find((p) => p.player_id === socket.id)?.nickname
          }
          setPopup={handleChat}
          isOpen={isChatOpen}
          onClose={() => {
            setChatOpen(false);
          }}
          onNewMessage={handleNewMessage}
          unreadMessages={unreadMessages}
        />
      )}

      <EffectOverlay
        freeze={p1.freeze.active}
        blind={p1.blind.active}
        immunity={p1.immunity.active}
      />
      <WinnerOverlay
        room_id={room?.room_id}
        winner={winner}
        isOpen={winner ? true : false}
      />
      {p1.player_id !== socket.id && (
        <button
          type="button"
          className={styles.switchView}
          onClick={handleFlipView}
        >
          <img src={iconSwitch} alt="Trocar" className={styles.icon} />
          Trocar
        </button>
      )}
    </div>
  );
}
