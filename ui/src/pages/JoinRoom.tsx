import { useEffect, useState } from "react";
import type { Game } from "../utils/room_utils";
import "../styles/JoinRoom.css";

function JoinRoom() {
  const [rooms, setRooms] = useState<Game[]>([]);

  async function reloadRooms() {
    const response = await fetch("http://localhost:3333/rooms/getRooms");
    const data = await response.json();
    setRooms(data);
  }

  useEffect(() => {
    reloadRooms();
  }, []);

  return (
    <div>
      <h1>Entrar na Sala</h1>

      <div>
        <button>Inserir código da sala</button>
        <button onClick={reloadRooms}>Recarregar Salas</button>
      </div>

      <div id="Rooms">
        {rooms.map((room) => (
          <div key={room.room_id}>
            <h2>{room.players.map((p) => p.nickname).join(", ")}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default JoinRoom;