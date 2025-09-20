import styles from "../styles/Room/RoomItem.module.css";
import type { Game } from "../utils/room_utils";

interface RoomItemProps {
    room: Game;
    color: "blue" | "orange";
}

export default function RoomItem({ room, color }: RoomItemProps) {

    return (
        <div className={`${styles.item} ${styles[color]}`}>
            <p>{room.players[0].nickname}</p>
            <div className={styles.players}>
                <p>{room.players.length}/2</p>
            </div>
        </div>
    );
}