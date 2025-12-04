interface CreateRoom {
  room_name: string;
  allowSpectators: boolean;
  privateRoom: boolean;
  player_id: string;
}

interface RoomParams {
  room_id: string;
}

interface ActionParams {
  room_id: string;
  player_id: string;
}

interface JoinRoom {
  spectator: boolean;
  player_id: string;
}

interface LeaveRoom {
  room_id: string;
  player_id: string;
}

interface ChangeRole {
  role: "player" | "spectator";
  index: number;
}

interface RemovePlayer {
  banned: boolean;
}

export {
  CreateRoom,
  RoomParams,
  ActionParams,
  JoinRoom,
  LeaveRoom,
  ChangeRole,
  RemovePlayer,
};
