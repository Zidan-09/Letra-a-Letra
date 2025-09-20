export type Player = {
  player_id?: string;
  nickname: string;
  score?: number;
};

export type Room = {
  room_id: string;
  theme?: string;
  privateRoom?: boolean;
  players?: Player[];
};
