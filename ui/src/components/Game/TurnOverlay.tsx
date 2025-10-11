import styles from "../../styles/Game/TurnOverlay.module.css";
import type { Player } from "../../utils/room_utils";

interface TurnOverlayProps {
    p1: Player;
    p2Nickname: string;
    turn: number;
}

export default function TurnOverlay({ p1, p2Nickname, turn }: TurnOverlayProps) {
    const isMe = turn % 2 === p1.turn;

    return (
        <div className={styles.overlay}>
            <div className={isMe ? styles.p1 : styles.p2}>
                <h2 className={styles.turnText}>{isMe ? p1.nickname : p2Nickname}</h2>
            </div>
        </div>
    )
}