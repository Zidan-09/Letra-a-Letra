import type { CellKeys, CellUpdate, MovementsEnum } from "../../utils/room_utils";
import Cell from "./Cell";
import styles from "../../styles/Game/Board.module.css";

interface BoardProps {
  cellsData: Record<CellKeys, CellUpdate>;
  move: MovementsEnum;
  moveIdx?: number;
  onCellClick?: (x: number, y: number) => void;
}

export default function Board({ cellsData, move, moveIdx, onCellClick }: BoardProps) {
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
                blocked={cellData?.blocked}
                trapped_by={cellData?.trapped_by}
                trapTrigged={cellData?.trapTrigged}
                detected={cellData?.detected}
                spied={cellData?.spied}
                x={x}
                y={y}
                selectedMovement={move}
                movementId={moveIdx}
                onClick={onCellClick ? onCellClick : undefined}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}