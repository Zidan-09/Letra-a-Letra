import type { CellKeys, CellUpdate } from "../../utils/room_utils";
import Cell from "./Cell";
import styles from "../../styles/Game/Board.module.css";

interface BoardProps {
  onCellClick: (x: number, y: number) => void;
  cellsData: Record<CellKeys, CellUpdate>;
}

export default function Board({ cellsData, onCellClick }: BoardProps) {

  return (
    <div className={styles.board}>
      {Array.from({ length: 10 }).map((_, y) => (
        <div key={y} className={styles.row}>
            {Array.from({ length: 10 }).map((_, x) => {
            const key = `${x}-${y}` as CellKeys;
            const cellData = cellsData[key];
            return (
                <Cell
                key={key}
                player_id={cellData?.actor}
                letter={cellData?.letter}
                onClick={() => onCellClick(x, y)}
                />
            );
            })}
        </div>
        ))}
    </div>
  );
}