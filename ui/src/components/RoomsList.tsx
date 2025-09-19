import React from "react";
import RoomItem from "./RoomItem";
import type { Game } from "../utils/room_utils";
import styles from "../styles/Room/RoomsList.module.css";

interface Props {
  rooms: Game[];
  selectedRoom: Game | null;
  setSelectedRoom: (room: Game) => void;
}

const RoomsList: React.FC<Props> = ({ rooms, selectedRoom, setSelectedRoom }) => {
  return (
    <div className={styles.list}>
      {rooms.map((room, index) => (
        <RoomItem
          key={room.room_id}
          room={room}
          selected={selectedRoom?.room_id === room.room_id}
          onSelect={() => setSelectedRoom(room)}
          color={index % 2 === 0 ? "blue" : "orange"}
        />
      ))}
    </div>
  );
};

export default RoomsList;