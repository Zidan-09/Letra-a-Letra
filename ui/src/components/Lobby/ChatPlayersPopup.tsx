import { useSocket } from "../../services/socketProvider";
import type { Player } from "../../utils/room_utils";
import kickIcon from "../../assets/buttons/icon-kick.svg";
import banIcon from "../../assets/buttons/icon-ban.svg";
import unbanIcon from "../../assets/buttons/icon-unban.svg";
import styles from "../../styles/Lobby/ChatPlayersPopup.module.css";

interface ChatPlayersPopupProps {
    players?: Player[] | undefined;
    banneds?: Player[] | undefined;
    isOpen: boolean;
    selected: string | undefined;
    select: (player_id: string) => void;
    unban: (player_id: string) => void;
    removePlayer: (ban: boolean) => void;
}

export default function ChatPlayersPopup({ players, banneds, isOpen, selected, select, unban, removePlayer}: ChatPlayersPopupProps) {
    if (!isOpen || !players || !banneds) return;
    if (players.filter(Boolean).length === 1 && banneds.length === 0) return;
    
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
                                        src={kickIcon}
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
                                        src={banIcon}
                                        alt="Ban"
                                        className={styles.icon}
                                        />
                                    </button>
                                </div>
                            )}

                        </div>
                    )       
            )}

            {banneds.map((banned, index) => 
                <div
                key={index}
                className={styles.banned}
                >
                    <p className={styles.bannedNickname}>{banned.nickname}</p>

                    <button
                    type="button"
                    className={styles.unban}
                    onClick={() => unban(banned.player_id)}
                    >
                        <img
                        src={unbanIcon}
                        alt="Unban"
                        className={styles.icon}
                        />
                    </button>
                </div>
            )}
        </div>
    )
}