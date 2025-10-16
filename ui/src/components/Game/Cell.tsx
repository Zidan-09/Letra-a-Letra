import React from "react";
import { useSocket } from "../../services/socketProvider";
import type { CellUpdate, MovementsEnum, Player } from "../../utils/room_utils";
import BlockOverlay from "./Powers/BlockOverlay";
import TrapOverlay from "./Powers/TrapOverlay";
import styles from "../../styles/Game/Cell.module.css";
import BlindOverlay from "./Powers/BlindOverlay";

interface CellProps {
    p1: Player;
    player_id?: string;
    finded?: string;
    letter?: string;
    blocked?: { blocked_by?: string; remaining?: number };
    trapped_by?: string;
    trapTrigged: boolean;
    detected: boolean;
    spied: boolean;
    hided: CellUpdate[];
    x: number;
    y: number;
    selectedMovement: MovementsEnum;
    movementId?: number;
    onClick?: (x: number, y: number) => void;
}

function CellComponent({ p1, player_id, finded, letter, blocked, trapped_by, trapTrigged, detected, spied, hided, selectedMovement, x, y, onClick }: CellProps) {
    const socket = useSocket();

    const cantCellMove = ["BLIND", "FREEZE", "LANTERN", "UNFREEZE", "IMMUNITY", "DETECT_TRAPS"].includes(selectedMovement);

    let className = "";

    if (finded) {
    className = finded === socket.id ? styles.findedMe : styles.findedOppo;
    } else if (player_id) {
    className = player_id === socket.id ? styles.me : styles.opponent;
    }

    return (
        <button
            className={`${styles.cell} ${className} ${cantCellMove ? styles.effect : ""}`}
            onClick={letter ? undefined : cantCellMove ? undefined : onClick ? () => onClick(x, y) : undefined}
            type="button"
            translate="no"
        >
            {spied || letter ? letter : ""}

            <BlockOverlay
            p1={p1}
            blocked_by={blocked?.blocked_by}
            remaining={blocked?.remaining}
            />

            <TrapOverlay
            p1={p1}
            trapped_by={trapped_by}
            detected={detected}
            trapTrigged={trapTrigged}
            />

            <BlindOverlay
            p1={p1}
            x={x}
            y={y}
            cells={hided}
            />

        </button>
    );
}

export default React.memo(CellComponent, (prev, next) => {
  return (
    prev.player_id === next.player_id &&
    prev.finded === next.finded &&
    prev.letter === next.letter &&
    JSON.stringify(prev.blocked) === JSON.stringify(next.blocked) &&
    prev.trapped_by === next.trapped_by &&
    prev.detected === next.detected &&
    prev.trapTrigged === next.trapTrigged &&
    prev.spied === next.spied &&
    prev.selectedMovement === next.selectedMovement &&
    prev.movementId === next.movementId &&
    prev.p1.blind.active === next.p1.blind.active &&
    prev.hided === next.hided
  );
});