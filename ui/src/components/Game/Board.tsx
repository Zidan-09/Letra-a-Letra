import type { Board } from "../../utils/room_utils";
import Cell from "./Cell";
import styles from "../../styles/Game/Board.module.css";

interface BoardProps {
    board: Board | null
    onClickCell: (x: number, y: number) => void;
}

export default function Board({ board, onClickCell }: BoardProps) {
    if (!board) return null;

    return (
        <div className={styles.board}>
            <div className={styles.panel}>
                {board.grid.map((row, x) =>
                        row.map((cell, y) => (
                            <Cell 
                                key={`${x}-${y}`}
                                cell={cell}
                                onClickCell={onClickCell}
                            />
                        ))
                    )}
            </div>
        </div>
    )
}