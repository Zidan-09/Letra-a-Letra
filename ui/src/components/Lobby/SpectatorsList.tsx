import type { Player } from "../../utils/room_utils";
import styles from "../../styles/Lobby/SpectatorsList.module.css";
import SpectatorItem from "./SpectatorItem";

interface SpectatorsListProps {
    spectators: Player[];
}

export default function SpectatorsList({ spectators }: SpectatorsListProps) {
    return (
        <div className={styles.spectatorList}>
            {Array.from({ length: 5 }).map((_, index) => {
                const spectator = spectators[index];

                return spectator ? (
                    <SpectatorItem
                    avatar={spectator.avatar}
                    />
                ) : (
                    <div className={styles.empty}></div>
                )
            })}
        </div>
    )
}