import React from "react";
import type { Game } from "../utils/room_utils";
import styles from "../styles/Room/RoomItem.module.css";

interface Props {
  room: Game;
  selected: boolean;
  onSelect: () => void;
  color: "blue" | "orange";
}

const RoomItem: React.FC<Props> = ({ room, selected, onSelect, color }) => {
  const playersCount = room.players.length;

  return (
    <div
      className={`${styles.card} ${styles[color]} ${
        selected ? styles.selected : ""
      }`}
      onClick={onSelect}
    >
      <div>ID: {room.room_id}</div>
      <div>Criador: {room.players[0].nickname}</div>
      <div
        className={`${styles.players} ${
          playersCount === 2 ? styles.full : styles.available
        }`}
      >
        {playersCount}/2
      </div>
    </div>
  );
};

export default RoomItem;