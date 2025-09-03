export class Board {
    private range: number = 7;
    private words: string[];

    constructor(words: string[]) {
        this.words = words;
        this.createBoard(this.words);
    }

    private createBoard(words: string[]) {
        // TODO: create a algortm to pos the words on board
    }

    protected revealLetter(pos_1: number, pos_2: number) {
        // TODO: create a function to reveal a letter
    }
}