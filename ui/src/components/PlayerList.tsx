import React from "react";
import type { Player } from "../utils/room_utils";
import styles from "../styles/PlayerList.module.css";

const PlayerList: React.FC<{ players: Player[] }> = ({ players }) => (
  <div className={styles.players}>
    {players.map((p) => (
      <div key={p.player_id} className={styles.playerCard}>
        {p.nickname}
      </div>
    ))}
  </div>
);

export default PlayerList;
