interface StartGame {
    room_id: string;
}

interface RevealLetter {
    room_id: string;
    player_id: string;
    x: number;
    y: number;
}

export { StartGame, RevealLetter }