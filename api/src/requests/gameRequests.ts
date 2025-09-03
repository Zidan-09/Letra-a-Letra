interface RevealLetter {
    pos_1: number;
    pos_2: number;
}

interface GameReq {
    room_id: string;
    player: string;
    positions: RevealLetter;
}
export { GameReq }