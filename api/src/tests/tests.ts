import { Cell } from "../entities/cell";

let cell: Cell = new Cell("S", 0, 0);

while (!cell.power.hasPowerup) {
    cell = new Cell("S", 0, 0);
}

console.log(cell);