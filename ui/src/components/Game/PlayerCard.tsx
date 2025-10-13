import { useState, useEffect } from "react";
import type { Player } from "../../utils/room_utils";
import { avatars } from "../../utils/avatars";
import styles from "../../styles/Game/PlayerCard.module.css";

interface PlayerCardProps {
    id: 0 | 1;
    player: Player;
    timer: number | undefined;
    turn: number;
}

export default function PlayerCard({ id, player, timer, turn }: PlayerCardProps) {
    const [progress, setProgress] = useState<number>(0);
    const [borderColor, setBorderColor] = useState("#4caf50");

    if (!player || !timer) return;

    const timerBorder = turn % 2 === player.turn;

    useEffect(() => {
        if (!timerBorder) {
            setProgress(0);
            setBorderColor("white")
            return;
        }

        setProgress(0);
        setBorderColor("#4caf50");
        const start = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - start;
            const prog = Math.min(elapsed / (timer * 1000), 1);
            setProgress(prog);

            if (prog < 0.5) {
                setBorderColor("#4caf50");
            } else if (prog < 0.8) {
                setBorderColor("#ffe600ff");
            } else {
                setBorderColor("#f44336");
            }
        }, 16);

        return () => clearInterval(interval);
    }, [turn, timer, timerBorder]);

    return (
        <div className={`${styles.card} ${id === 0 ? styles.p1 : styles.p2}`}>
            <div
            className={styles.avatarContainer}
            style={{
                "--progress": progress,
                "--border-color": borderColor
            } as React.CSSProperties}
            >
                <img 
                src={avatars[player.avatar]} 
                alt="Avatar"
                className={id === 0 ? styles.avatarP1 : styles.avatarP2} 
                />
            </div>

            <div className={styles.infoContainer}>
                <h2 className={styles.nickname}>{player.nickname}</h2>
                <div className={id === 0 ? styles.powersContainerP1 : styles.powersContainerP2}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        player.powers[index] ? (
                            <div
                            key={index}
                            className={id === 0 ? styles.p1Powers : styles.p2Powers}
                            ></div>
                        ) : (
                            <div
                            key={index}
                            className={id === 0 ? styles.p1Empty : styles.p2Empty}
                            ></div>
                        )
                    ))}
                </div>
            </div>
        </div>
    )
}