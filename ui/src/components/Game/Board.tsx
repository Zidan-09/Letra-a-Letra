import type { CellKeys, CellUpdate } from "../../utils/room_utils";
import Cell from "./Cell";
import styles from "../../styles/Game/Board.module.css";

interface BoardProps {
  cellsData: Record<CellKeys, CellUpdate>;
  onCellClick?: (x: number, y: number) => void;
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
                finded={cellData?.finded_by}
                letter={cellData?.letter}
                onClick={onCellClick ? () => onCellClick(x, y) : undefined}
                />
            );
            })}
        </div>
        ))}
    </div>
  );
}