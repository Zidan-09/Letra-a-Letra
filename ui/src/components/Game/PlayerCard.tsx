import type { Player } from "../../utils/room_utils";
import { avatars } from "../../utils/avatars";
import styles from "../../styles/Game/PlayerCard.module.css";

interface PlayerCardProps {
    id: 0 | 1;
    player: Player
}

export default function PlayerCard({ id, player }: PlayerCardProps) {
    if (!player) return;

    return (
        <div className={`${styles.card} ${id === 0 ? styles.p1 : styles.p2}`}>
            <div className={styles.avatarContainer}>
                <img 
                src={avatars[player.avatar]} 
                alt="Avatar"
                className={styles.avatar} 
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