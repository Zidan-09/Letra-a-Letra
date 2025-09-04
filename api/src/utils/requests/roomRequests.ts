interface CreateRoom {
    socket_id: string;
    nickname: string;
}

interface JoinRoom {
    socket_id: string;
    nickname: string;
    room_id: string;
}

interface GetRoom {
    room_id: string
}

export { CreateRoom, JoinRoom, GetRoom }