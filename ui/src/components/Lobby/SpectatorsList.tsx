import type { Game } from "../../utils/room_utils";
import { useSocket } from "../../services/socketProvider";
import { Server } from "../../utils/server_utils";
import SpectatorItem from "./SpectatorItem";
import styles from "../../styles/Lobby/SpectatorsList.module.css";

interface SpectatorsListProps {
    room: Game;
}

export default function SpectatorsList({ room }: SpectatorsListProps) {
    const socket = useSocket();

    const handleTurnSpectator = async (index: number) => {
        await fetch(`${Server}/room/${room.room_id}/players/${socket.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                role: "spectator",
                index: index
            })
        }).then(res => res.json()).then(data => data);
    }

    return (
        <div className={styles.spectatorList}>
            {room.spectators.map((_, index) => {
                const spectator = room.spectators[index];

                return spectator ? (
                    <SpectatorItem
                    key={index}
                    avatar={spectator.avatar}
                    />
                ) : (
                    <div className={styles.empty} key={index} onClick={() => handleTurnSpectator(index)}></div>
                )
            })}
        </div>
    )
}