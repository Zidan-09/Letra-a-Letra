export class Player {
    player_id: string;
    nickname: string;
    turn: 0 | 1;
    score: number = 0;
    passed: number = 0;
    freeze: boolean = false;

    constructor(player_id: string, nickname: string) {
        this.player_id = player_id;
        this.nickname = nickname;
        this.turn = 0;
    }

    public addScore() {
        this.score++;
    }

    public addPass() {
        this.passed++;
    }

    public resetPass() {
        this.passed = 0
    }
}