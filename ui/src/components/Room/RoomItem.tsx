import styles from "../../styles/Room/RoomItem.module.css";
import type { Game } from "../../utils/room_utils";

interface RoomItemProps {
  room: Game;
  color: "blue" | "orange";
  onSelect: (room_id: string) => void;
  selected: boolean;
}

export default function RoomItem({
  room,
  color,
  onSelect,
  selected,
}: RoomItemProps) {
  const playerInRoom = (
    room.players.filter(Boolean).length as 0 | 1 | 2
  ).toString();

  return (
    <div
      className={`${styles.item} ${styles[color]} ${
        selected ? styles.selected : ""
      }`}
      onClick={selected ? () => onSelect("") : () => onSelect(room.room_id)}
    >
      <div className={styles.container1}>
        <p className={styles.room_name}>{room.room_name}</p>
        <div className={`${styles.players} ${styles[`color_${playerInRoom}`]}`}>
          <p>{room.players.filter(Boolean).length}/2</p>
        </div>
      </div>

      <div className={styles.container2}>
        <p className={styles.createdBy}>{room.creator}</p>
      </div>
    </div>
  );
}
