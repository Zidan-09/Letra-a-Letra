import React from "react";
import type { Cell } from "../../utils/room_utils";
import styles from "../../styles/Game/Cell.module.css";

interface CellProps {
    cell: Cell;
    onClickCell: (x: number, y: number) => void;
}

export default React.memo(function Cell({ cell, onClickCell }: CellProps) {
    const classes = [
        styles.cell,
        cell.revealed ? styles.revealed : "",
        cell.blocked.status ? styles.blocked : "",
        cell.trapped.status ? styles.trapped : ""
    ].join(" ");

    return (
        <div
            className={classes}
            onClick={() => onClickCell(cell.position.x, cell.position.y)}
        >
            {cell.revealed ? cell.letter : ""}
        </div>
    );
});
