import type { Player } from "../../utils/room_utils";
import styles from "../../styles/Lobby/SpectatorsList.module.css";
import SpectatorItem from "./SpectatorItem";

interface SpectatorsListProps {
    spectators: Player[];
}

export default function SpectatorsList({ spectators }: SpectatorsListProps) {
    return (
        <div className={styles.list}>
            {spectators.length === 0 ? (
                <div>

                </div>
            ) : (
                spectators.map((spectator, index) => (
                    <SpectatorItem
                    key={index}
                    avatar={spectator.turn}
                    />
                ))
            )}
        </div>
    )
}