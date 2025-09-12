interface CreateRoom {
    socket_id: string;
    nickname: string;
    privateRoom: boolean;
}

interface JoinRoom {
    socket_id: string;
    nickname: string;
    room_id: string;
}

interface LeaveRoom {
    room_id: string;
    player_id: string;
}

interface GetRoom {
    room_id: string
}

export { CreateRoom, JoinRoom, LeaveRoom, GetRoom }