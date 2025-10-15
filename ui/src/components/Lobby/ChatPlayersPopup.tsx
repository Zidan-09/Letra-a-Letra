import { useSocket } from "../../services/socketProvider";
import type { Player } from "../../utils/room_utils";
import kick from "../../assets/buttons/icon-kick.svg";
import ban from "../../assets/buttons/icon-ban.svg";
import styles from "../../styles/Lobby/ChatPlayersPopup.module.css";

interface ChatPlayersPopupProps {
    players?: Player[] | undefined;
    isOpen: boolean;
    selected: string | undefined;
    select: (player_id: string) => void;
    unban: () => void;
    removePlayer: (ban: boolean) => void;
}

export default function ChatPlayersPopup({ players, isOpen, selected, select, removePlayer}: ChatPlayersPopupProps) {
    if (!isOpen || !players || players.filter(Boolean).length === 1) return;

    const socket = useSocket();

    return (
        <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
        >
            {players.filter(Boolean).map((player, index) => 
                    player.player_id !== socket.id && (
                        <div
                        key={index}
                        className={selected === player.player_id ? styles.selected : styles.player}
                        onClick={selected === player.player_id ? () => select("") : () => select(player.player_id)}
                        >
                            <p className={styles.nickname}>{player.nickname}</p>

                            {selected === player.player_id && (
                                <div className={styles.buttons}>
                                    <button
                                    type="button"
                                    className={styles.kick}
                                    onClick={() => removePlayer(false)}
                                    >
                                        <img
                                        src={kick}
                                        alt="Kick"
                                        className={styles.icon}
                                        />
                                    </button>

                                    <button
                                    type="button"
                                    className={styles.ban}
                                    onClick={() => removePlayer(true)}
                                    >
                                        <img
                                        src={ban}
                                        alt="Ban"
                                        className={styles.icon}
                                        />
                                    </button>
                                </div>
                            )}

                        </div>
                    )       
            )}
        </div>
    )
}