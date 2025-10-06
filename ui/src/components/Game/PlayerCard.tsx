import type { Player } from "../../utils/room_utils";
import { useSocket } from "../../services/socketProvider";
import { avatars } from "../../utils/avatars";
import styles from "../../styles/Game/PlayerCard.module.css";

interface PlayerCardProps {
    player: Player
}

export default function PlayerCard({ player }: PlayerCardProps) {
    if (!player) return;

    const socket = useSocket();

    return (
        <div className={`${styles.card} ${player.player_id === socket.id ? styles.me : styles.opponent}`}>
            <div className={styles.avatarContainer}>
                <img 
                src={avatars[player.avatar]} 
                alt="Avatar"
                className={styles.avatar} 
                />
            </div>

            <div className={styles.infoContainer}>
                <h2 className={styles.nickname}>{player.nickname}</h2>
                <div className={player.player_id === socket.id ? styles.powersContainerMe : styles.powersContainerOppo}>
                    {Array.from({ length: 5 }).map((_, index) => (
                        player.powers[index] ? (
                            <div
                            key={index}
                            className={player.player_id === socket.id ? styles.mePowers : styles.oppoPowers}
                            ></div>
                        ) : (
                            <div
                            key={index}
                            className={player.player_id === socket.id ? styles.meEmpty : styles.oppoEmpty}
                            ></div>
                        )
                    ))}
                </div>
            </div>
        </div>
    )
}