interface CreatePlayer {
  player_id: string;
  nickname: string;
  avatar: number;
}

interface GetPlayer {
  player_id: string;
}

interface DeletePlayer {
  player_id: string;
}

export { CreatePlayer, GetPlayer, DeletePlayer };
