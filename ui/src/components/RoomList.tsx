import type { Game } from "../utils/room_utils";

interface RoomListProps {
  rooms: Game[];
}

export default function RoomList({ rooms }: RoomListProps) {
  return (
    <div>
      {rooms.map((room) => (
        <div key={room.room_id}>
          <h2>{room.players.map((p) => p.nickname).join(", ")}</h2>
        </div>
      ))}
    </div>
  );
}