import { useEffect, useState } from "react";
import RoomList from "../components/RoomList";
import type { Game } from "../utils/room_utils";

function Room() {
  const [rooms, setRooms] = useState<Game[]>([]);

  useEffect(() => {
    async function fetchRooms() {
      const response = await fetch("http://localhost:3333/rooms/getRooms");
      const data: Game[] = await response.json().then(data => data.data);
      setRooms(data);
    }

    fetchRooms();
  });

  return (
    <div>
      <h1>Salas</h1>
      <RoomList rooms={rooms} />
    </div>
  );
}

export default Room;