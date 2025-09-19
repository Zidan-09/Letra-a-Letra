import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io, { Socket } from "socket.io-client";
import type { Game as GameType, Player } from "../utils/room_utils";
import { Movements } from "../utils/game_utils";
import Board from "../components/Board";
import PlayerList from "../components/PlayerList";
import SpectatorList from "../components/SpectatorList";
import Controls from "../components/Controls";
import styles from "../styles/Game.module.css";

const Game: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomSettings = location.state as { nickname: string; theme: string; private: boolean } | undefined;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [game, setGame] = useState<GameType | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTurn, setCurrentTurn] = useState<Player | null>(null);
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    if (!roomSettings?.nickname) {
      alert("Dados da sala inválidos!");
      navigate("/");
      return;
    }

    const socketConnection = io("http://localhost:3333");
    setSocket(socketConnection);

    socketConnection.on("connect", async () => {
      const res = await fetch("http://localhost:3333/room/createRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          socket_id: socketConnection.id,
          theme: roomSettings.theme,
          privateRoom: roomSettings.private,
        }),
      });
      const data: GameType = await res.json().then(d => d.data);
      setGame(data);
      setLoading(false);
    });

    socketConnection.on("room:update", (updatedGame: GameType) => setGame(updatedGame));

    socketConnection.on("game_started", (payload: { first: Player; words: string[] }) => {
      setCurrentTurn(payload.first);
      setWords(payload.words);
      if (game) setGame({ ...game, status: "game_running" });
    });

    socketConnection.on("movement", (payload) => {
      // Atualiza o game conforme movimentos recebidos
      if (game) setGame({ ...game, lastMovement: payload });
    });

    socketConnection.on("game_over", (payload: { winner: Player }) => {
      if (game) setGame({ ...game, status: "game_over", winner: payload.winner });
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const leaveRoom = () => navigate("/rooms", { state: { nickname: roomSettings?.nickname } });

  const startGame = async () => {
    if (!game) return;
    await fetch(`http://localhost:3333/game/startGame`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId: game.room_id, theme:  roomSettings?.theme }),
    });
  };

  const handleCellClick = async (x: number, y: number) => {
    if (!game || !currentTurn) return;
    await fetch("http://localhost:3333/game/moveGame", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room_id: game.room_id,
        player_id: currentTurn.player_id,
        movement: Movements.REVEAL,
        x,
        y,
      }),
    });
  };

  if (loading || !game) return <div className={styles.loading}>Carregando jogo...</div>;

  return (
    <div className={styles.container}>
      {game.status === "game_starting" && (
        <div className={styles.waiting}>
          <PlayerList players={game.players} />
          <SpectatorList spectators={game.spectators} />
          <Controls onLeave={leaveRoom} onStart={startGame} canStart={game.players.length >= 2} />
        </div>
      )}

      {game.status === "game_running" && (
        <div className={styles.playing}>
          <h2>Jogo em andamento</h2>
          <p>Vez de: {currentTurn?.nickname}</p>
          <Board onCellClick={handleCellClick} />
        </div>
      )}

      {game.status === "game_over" && (
        <div className={styles.victory}>
          <h2>Vitória!</h2>
          {game.winner && <p>Vencedor: {game.winner.nickname}</p>}
        </div>
      )}
    </div>
  );
};

export default Game;