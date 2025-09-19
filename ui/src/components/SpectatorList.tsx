import React from "react";
import type { Player } from "../utils/room_utils";
import styles from "../styles/SpectatorList.module.css";

interface Props {
  spectators: Player[];
}

const SpectatorList: React.FC<Props> = ({ spectators }) => (
  <div className={styles.spectators}>
    {spectators.map((s) => (
      <div key={s.player_id} className={styles.spectatorCard}>
        {s.nickname || "Espectador"}
      </div>
    ))}
  </div>
);

export default SpectatorList;
