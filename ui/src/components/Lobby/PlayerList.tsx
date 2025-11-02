import PlayerItem from "./PlayerItem";
import type { Game } from "../../utils/room_utils";
import { useSocket } from "../../services/socketProvider";
import settings from "../../settings.json";
import styles from "../../styles/Lobby/PlayerList.module.css";

interface PlayerListProps {
  room: Game;
}

export default function PlayerList({ room }: PlayerListProps) {
  const socket = useSocket();

  const handleTurnPlayer = async (index: number) => {
    const result = await fetch(
      `${settings.server}/room/${room.room_id}/players/${socket.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "player",
          index: index,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => data);

    if (!result.success) console.warn(result);
  };

  return (
    <div className={styles.playerList}>
      {room.players.map((_, index) => {
        const player = room.players[index];

        return player ? (
          <PlayerItem
            key={index}
            avatar={player.avatar}
            nickname={player.nickname}
          />
        ) : (
          <div
            className={styles.empty}
            key={index}
            onClick={() => handleTurnPlayer(index)}
          >
            <div className={styles.avatar}></div>
            <p className={styles.nickname}>Vazio</p>
          </div>
        );
      })}
    </div>
  );
}
