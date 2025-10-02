import type { Player } from "../../utils/room_utils";
import { avatars } from "../../utils/avatars";
import styles from "../../styles/Game/PlayerCard.module.css";

interface PlayerCardProps {
    player: Player
}

export default function PlayerCard({ player }: PlayerCardProps) {

    return (<div className={styles.card}>
        <img src={avatars[player.avatar]} alt="Avatar" />

        <div>
            <h2 className={styles.nickname}>{player.nickname}</h2>
            
            {Array.from({ length: 5 }).map((_, index) => {
                const power = player.powers[index];

                return power ? (
                    <div className={styles.have} ></div>
                ) : (
                    <div className={styles.empty} ></div>
                )
            })}
        </div>
    </div>)
}