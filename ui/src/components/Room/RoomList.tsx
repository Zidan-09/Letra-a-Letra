import type { Game } from "../../utils/room_utils";
import RoomItem from "./RoomItem";
import styles from "../../styles/Room/RoomList.module.css";

interface RoomListProps {
  rooms: Game[];
  onSelectRoom: (room_id: string) => void;
  selectedRoom: string | null;
}

export default function RoomList({
  rooms,
  onSelectRoom,
  selectedRoom,
}: RoomListProps) {
  return (
    <div className={styles.roomList}>
      {rooms.length === 0 ? (
        <div className={styles.emptyMessage}>Sem salas disponíveis</div>
      ) : (
        rooms.map((room, index) => (
          <RoomItem
            key={index}
            room={room}
            color={index % 2 === 0 ? "blue" : "orange"}
            onSelect={onSelectRoom}
            selected={selectedRoom === room.room_id}
          />
        ))
      )}
    </div>
  );
}
