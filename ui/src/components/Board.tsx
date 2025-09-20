import React from "react";
import styles from "../styles/Board.module.css";

interface BoardProps {
  onCellClick: (x: number, y: number) => void;
}

const Board: React.FC<BoardProps> = ({ onCellClick }) => {
  return (
    <div className={styles.board}>
      {Array.from({ length: 10 }).map((_, row) => (
        <div key={row} className={styles.row}>
          {Array.from({ length: 10 }).map((_, col) => (
            <div
              key={`${row}-${col}`}
              className={styles.cell}
              onClick={() => onCellClick(row, col)}
            >
              {row},{col}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;