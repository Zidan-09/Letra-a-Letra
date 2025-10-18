import React, { useEffect } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import type { NullPlayer, Player } from "../../utils/room_utils";
import { avatars } from "../../utils/avatars";
import styles from "../../styles/Game/WinnerOverlay.module.css";

interface WinnerOverlayProps {
    room_id?: string;
    winner?: Player | NullPlayer;
    duration?: number;
    isOpen: boolean;
}

const WinnerOverlay: React.FC<WinnerOverlayProps> = ({
    room_id,
    winner,
    duration = 150000,
    isOpen,
}) => {
    const navigate = useNavigate();

  useEffect(() => {
    if (room_id && winner && isOpen) {
      const timer = setTimeout(() => navigate(`/lobby/${room_id}`), duration);
      return () => clearTimeout(timer);
    }
  }, [navigate, room_id, winner, isOpen, duration]);

  if (!room_id || !winner || !isOpen) return null;

  const handleLobby = () => {
    if (room_id) navigate(`/lobby/${room_id}`);
  };

  const isNullWinner = winner.nickname === "null";

  return (
    <div className={styles.overlay} onClick={handleLobby}>
      {!isNullWinner && <Confetti numberOfPieces={300} recycle={false} />}

      <div className={styles.card}>
        {isNullWinner ? (
          <>
            <h1 className={styles.title}>🕹️ Partida encerrada</h1>
            <p className={styles.subtitle}>
              Nenhum vencedor — todos os jogadores saíram.
            </p>
            <button
              type="button"
              className={`${styles.button} ${styles.lobby}`}
              onClick={handleLobby}
            >
              Voltar ao Lobby
            </button>
          </>
        ) : (
          <>
            <h1 className={styles.title}>{winner.nickname}<br />Venceu!🏆</h1>
            {winner.avatar && avatars[winner.avatar] ? (
              <img
                src={avatars[winner.avatar]}
                alt={winner.nickname}
                className={styles.avatar}
              />
            ) : null}
            <div className={styles.stats}>
              <p>
                Pontuação: <span>{winner.score}</span>
              </p>
            </div>
            <button
              type="button"
              className={styles.button}
              onClick={handleLobby}
            >
              Voltar ao Lobby
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WinnerOverlay;