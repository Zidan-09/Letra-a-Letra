export interface Player {
    id: string;
    nickname: string;
    turn: number | undefined;
    score: number;
    passed: number;
}