export class Board {
    private range: number = 9;
    private words: string[];
    private grid: string[][];
    private revealed: boolean[][];

    constructor() {
        this.words = this.selectTheme();
        this.grid = this.createBoard(this.words);
        this.revealed = this.initRevealed();
    }

    private createBoard(words: string[]): string[][] {
        const grid: string[][] = new Array(10).fill('').map(() => new Array(10).fill(''));

        const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [1, 1], [-1, -1], [1, -1], [-1, 1]
        ];

        words.forEach(word => {
            let placed = false;

            while (!placed) {
                const row = Math.floor(Math.random() * this.range);
                const column = Math.floor(Math.random() * this.range);
                const [dx, dy] = directions[Math.floor(Math.random() * directions.length)]!;

                if (this.canPlaceWord(word, row, column, dx!, dy!, grid)) {
                    this.placeWord(word, row, column, dx!, dy!, grid);
                    placed = true;
                }
            }
        })

        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        for (let i = 0; i < this.range; i++) {
            for (let j = 0; j < this.range; j++) {
                if (grid[i]![j] === '') {
                    grid[i]![j] = alphabet[Math.floor(Math.random() * alphabet.length)]!;
                }
            }
        }

        return grid;
    }

    protected revealLetter(row: number, column: number) {
        if (this.revealed[row]![column] === false) {
            this.revealed[row]![column] = true;
            return this.grid[row]![column];
        }
    }

    private initRevealed(): boolean[][] {
        const matriz: boolean[][] = [];

        for (let i = 0; i < this.range; i++) {
            const row: boolean[] = [];

            for (let j = 0; j < this.range; j++) {
                row.push(false);
            }

            matriz.push(row);
        }

        return matriz;
    }

    private selectTheme() {
        const Themes = {
            tech: ["backend", "frontend", "database", "software", "hardware"],
            fruits: ["banana", "laranja", "abacaxi", "cereja", "ameixa"],
            cities: ["lisboa", "paris", "roma", "tokyo", "londres"]
        }

        const theme = Math.floor(Math.random() * (3 - 1 + 1)) + 1;

        switch (theme) {
            case 1:
                return Themes.tech;
            case 2:
                return Themes.fruits;
            default:
                return Themes.cities;
        }
    }

    private canPlaceWord(word: string, row: number, column: number, dx: number, dy: number, grid: string[][]): boolean {
        for (let i = 0; i < word.length; i++) {
            const x = row + dx * i;
            const y = column + dy * i;

            if (x < 0 || y < 0 || x >= this.range || y >= this.range) {
                return false;
            }

            if (grid[x]![y] !== '' && grid[x]![y] !== word[i]) {
                return false;
            }
        }

        return true;
    }

    private placeWord(word: string, row: number, column: number, dx: number, dy: number, grid: string[][]) {
        for (let i = 0; i < word.length; i++) {
            const x = row + dx * i;
            const y = column + dy * i;
            grid[x]![y] = word[i]!;
        }
    }
}