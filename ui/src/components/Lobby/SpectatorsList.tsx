import type { Game } from "../../utils/room_utils";
import { useSocket } from "../../services/socketProvider";
import { Server } from "../../utils/server_utils";
import SpectatorItem from "./SpectatorItem";
import styles from "../../styles/Lobby/SpectatorsList.module.css";

interface SpectatorsListProps {
    room: Game;
    updateRoom: (room: Game) => void;
}

export default function SpectatorsList({ room, updateRoom }: SpectatorsListProps) {
    const socket = useSocket();

    const handleTurnSpectator = async () => {
        const result = await fetch(`${Server}/room/${room.room_id}/players/${socket.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                role: "spectator"
            })
        }).then(res => res.json()).then(data => data);

        console.log(result);
        if (result.status) updateRoom(result.data);
    }

    return (
        <div className={styles.spectatorList}>
            {Array.from({ length: 5 }).map((_, index) => {
                const spectator = room.spectators[index];

                return spectator ? (
                    <SpectatorItem
                    avatar={spectator.avatar}
                    />
                ) : (
                    <div className={styles.empty} onClick={handleTurnSpectator}></div>
                )
            })}
        </div>
    )
}