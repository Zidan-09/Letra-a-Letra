interface CreatePlayer {
    player_id: string;
    nickname: string;
}

interface GetPlayer {
    player_id: string;
}

export { CreatePlayer, GetPlayer }