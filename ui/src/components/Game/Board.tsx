import type {
  CellKeys,
  CellUpdate,
  MovementsEnum,
  Player,
} from "../../utils/room_utils";
import Cell from "./Cell";
import styles from "../../styles/Game/Board.module.css";

interface BoardProps {
  p1: Player;
  turn: number;
  cellsData: Record<CellKeys, CellUpdate>;
  hideds: CellUpdate[];
  move: MovementsEnum;
  moveIdx?: number;
  onCellClick?: (x: number, y: number) => void;
}

export default function Board({
  p1,
  turn,
  cellsData,
  hideds,
  move,
  moveIdx,
  onCellClick,
}: BoardProps) {
  const isMine = turn % 2 === p1.turn;

  return (
    <div className={`${styles.board} ${isMine ? styles.p1 : styles.p2}`}>
      {Array.from({ length: 10 }).map((_, y) => (
        <div key={y} className={styles.row}>
          {Array.from({ length: 10 }).map((_, x) => {
            const key = `${x}-${y}` as CellKeys;
            const cellData = cellsData[key];
            return (
              <Cell
                key={key}
                p1={p1}
                player_id={cellData?.actor}
                finded={cellData?.finded_by}
                letter={cellData?.letter}
                blocked={cellData?.blocked}
                trapped_by={cellData?.trapped_by}
                trapTrigged={cellData?.trapTrigged}
                detected={cellData?.detected}
                spied={cellData?.spied}
                hided={hideds}
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
