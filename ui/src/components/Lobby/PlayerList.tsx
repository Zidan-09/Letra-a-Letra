import PlayerItem from "./PlayerItem";
import styles from "../../styles/Lobby/PlayerList.module.css";
import type { Player } from "../../utils/room_utils";

interface PlayerListProps {
    players: Player[];
}

export default function PlayerList({ players }: PlayerListProps) {
    return (
        <div className={styles.playerList}>
            {players.map((player, index) => (
                <PlayerItem key={index}
                avatar={player.score}
                nickname={player.nickname}
                />
            ))}
        </div>
    )
}