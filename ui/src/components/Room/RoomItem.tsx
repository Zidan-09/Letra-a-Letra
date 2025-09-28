import styles from "../../styles/Room/RoomItem.module.css";
import type { Game } from "../../utils/room_utils";

interface RoomItemProps {
    room: Game;
    color: "blue" | "orange";
    onSelect: (room_id: string) => void;
    selected: boolean;
}

export default function RoomItem({ room, color, onSelect, selected }: RoomItemProps) {

    const handleSelectRoom = () => {
        onSelect(room.room_id);
        localStorage.setItem("room_id", room.room_id);
    }

    const playerInRoom = (room.players.length as 1 | 2).toString();

    return (
        <div className={`${styles.item} ${styles[color]} ${selected ? styles.selected : ""}`}
        onClick={handleSelectRoom}
        >
            <p className={styles.room_name}>{room.room_name}</p>
            <div className={`${styles.players} ${styles[`color_${playerInRoom}`]}`}>
                <p>{room.players.length}/2</p>
            </div>
        </div>
    );
}