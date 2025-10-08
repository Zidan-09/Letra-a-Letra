import type { Player } from "../../../utils/room_utils";
import iconTrapCell from "../../../assets/powers/icon-trap-cell.png";
import styles from "../../../styles/Game/Powers/TrapOverlay.module.css";

interface TrapOverlayProps {
    p1: Player;
    trapped_by?: string;
    detected: boolean;
    trapTrigged: boolean;
}

export default function TrapOverlay({ p1, trapped_by, detected, trapTrigged }: TrapOverlayProps) {
    if (!trapped_by && !trapTrigged) return null;

    const isVisibleToBoth = trapTrigged || detected;

    if (!isVisibleToBoth && trapped_by !== p1.player_id) return null;

    const bgColor = trapped_by === p1.player_id ? styles.p1 : styles.p2;

    return (
        <div className={`${styles.overlay} ${bgColor} ${trapTrigged ? styles.trigged : ""}`}
        >
            <img
            src={iconTrapCell}
            alt="Icon"
            className={`${styles.icon} ${trapTrigged ? styles.trapped : ""}`}
            />
        </div>
    )
}