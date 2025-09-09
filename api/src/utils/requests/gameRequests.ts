interface StartGame {
    room_id: string;
}

interface RevealLetter {
    room_id: string;
    player_id: string;
    x: number;
    y: number;
}

interface PassTurn {
    room_id: string;
    player_id: string;
}

export { StartGame, RevealLetter, PassTurn }