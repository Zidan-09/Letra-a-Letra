import { GameResponses } from "../utils/responses/gameResponses";

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
        for (let i = 0; i <= this.range; i++) {
            for (let j = 0; j <= this.range; j++) {
                if (grid[i]![j] === '') {
                    grid[i]![j] = alphabet[Math.floor(Math.random() * alphabet.length)]!;
                }
            }
        }

        return grid;
    }

    public revealLetter(row: number, column: number) {
        if (this.revealed[row]![column] === false) {
            this.revealed[row]![column] = true;
            return this.grid[row]![column];
        } else {
            return GameResponses.AlmostRevealed
        }
    }

    private initRevealed(): boolean[][] {
        const revealed: boolean[][] = new Array(10).fill(false).map(() => new Array(10).fill(false));

        return revealed;
    }

    private selectTheme(): string[] {
        const Themes = {
            tech_1: ["backend", "frontend", "database", "software", "hardware"],
            tech_2: ["python", "typescript", "flutter", "nodejs", "java"],

            fruits_1: ["banana", "laranja", "abacaxi", "cereja", "ameixa"],
            fruits_2: ["manga", "amora", "acerola", "pera", "caqui"],

            cities_1: ["lisboa", "paris", "roma", "tokyo", "londres"],
            cities_2: ["berlim", "miami", "toronto", "oslo", "madrid"],

            animals_1: ["gato", "cachorro", "coelho", "macaco", "panda"],
            animals_2: ["tigre", "urso", "raposa", "cobra", "foca"],

            colors_1: ["vermelho", "azul", "amarelo", "roxo", "preto"],
            colors_2: ["branco", "verde", "rosa", "cinza", "bege"],

            sports_1: ["futebol", "basquete", "tenis", "golfe", "boxe"],
            sports_2: ["volei", "rugby", "surfe", "skate", "judo"],

            foods_1: ["pizza", "pasta", "sopa", "carne", "queijo"],
            foods_2: ["arroz", "feijao", "pao", "bolo", "batata"],

            jobs_1: ["medico", "professor", "advogado", "piloto", "ator"],
            jobs_2: ["engenheiro", "designer", "soldado", "chefe", "motorista"],

            nature_1: ["floresta", "oceano", "deserto", "rio", "montanha"],
            nature_2: ["lago", "ilha", "caverna", "vales", "gramado"],

            space_1: ["terra", "venus", "marte", "saturno", "urano"],
            space_2: ["plutao", "jupiter", "netuno", "mercurio", "lua"]
        };


        const themes = Object.values(Themes);
        const index = Math.floor(Math.random() * themes.length);

        if (themes[index]) return themes[index];
        
        return ["backend", "frontend", "database", "software", "hardware"];
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

    public debug() {
        return {
          grid: this.grid,
          words: this.words,
          bools: this.revealed
        };
    }
}