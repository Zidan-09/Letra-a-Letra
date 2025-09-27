import PlayerItem from "./PlayerItem";
import styles from "../../styles/Lobby/PlayerList.module.css";
import type { Player } from "../../utils/room_utils";

interface PlayerListProps {
    players: Player[];
}

export default function PlayerList({ players }: PlayerListProps) {
    return (
        <div className={styles.playerList}>
            {Array.from({ length: 2 }).map((_, index) => {
                const player = players[index];

                return player ? (
                    <PlayerItem
                    key={index}
                    avatar={player.avatar}
                    nickname={player.nickname}
                    />
                ) : (
                    <div className={styles.empty}>
                        <div className={styles.avatar}></div>
                        <p className={styles.nickname}></p>
                    </div>
                )
            })}
        </div>
    )
}