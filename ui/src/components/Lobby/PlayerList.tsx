import PlayerItem from "./PlayerItem";
import type { Game } from "../../utils/room_utils";
import { useSocket } from "../../services/socketProvider";
import { Server } from "../../utils/server_utils";
import styles from "../../styles/Lobby/PlayerList.module.css";

interface PlayerListProps {
    room: Game;
    updateRoom: (room: Game) => void;
}

export default function PlayerList({ room, updateRoom }: PlayerListProps) {
    const socket = useSocket();

    const handleTurnPlayer = async () => {
        const result = await fetch(`${Server}/room/${room.room_id}/players/${socket.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                role: "player"
            })
        }).then(res => res.json()).then(data => data);
        console.log(result)
        
        if (result.status) updateRoom(result.data);
    }

    return (
        <div className={styles.playerList}>
            {Array.from({ length: 2 }).map((_, index) => {
                const player = room.players[index];

                return player ? (
                    <PlayerItem
                    key={index}
                    avatar={player.avatar}
                    nickname={player.nickname}
                    />
                ) : (
                    <div className={styles.empty} onClick={handleTurnPlayer}>
                        <div className={styles.avatar}></div>
                        <p className={styles.nickname}>Vazio</p>
                    </div>
                )
            })}
        </div>
    )
}