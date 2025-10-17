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
    onClose?: () => void;
}

export default function ChatPlayersPopup({ players, banneds, isOpen, selected, select, unban, removePlayer, onClose}: ChatPlayersPopupProps) {
    if (!isOpen || !players || !banneds) return null;
    // if (players.filter(Boolean).length === 1 && banneds.length === 0) return;
    
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const socket = useSocket();
    const otherPlayers = players.filter(p => p && p.player_id !== socket.id);
    const hasBannedPlayers = banneds.length > 0;
    const isEmpty = otherPlayers.length === 0 && !hasBannedPlayers;


    return (
        <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
        >
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar">
                &times;
            </button>

            {/*aqui*/}
            <h3 className={styles.sectionTitle}>Jogadores na Sala</h3>
            {/*aqui*/}
            <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar">
                &times;
            </button>

            <div className={styles.playerList}>
                {isEmpty ? (
                    <p className={styles.emptyMessage}>Nenhum outro jogador na sala.</p>
                ) : (
                    otherPlayers.map((player, index) => (
                        <div
                            key={index}
                            className={selected === player.player_id ? styles.selected : styles.player}
                            onClick={selected === player.player_id ? () => select("") : () => select(player.player_id)}
                        >
                            <p className={styles.nickname}>{player.nickname}</p>
                            
                            {selected === player.player_id && (
                                <div className={styles.buttons}>
                                    <button type="button" className={styles.kick} onClick={() => removePlayer(false)}>
                                        <img src={kickIcon} alt="Kick" className={styles.icon} />
                                    </button>
                                    <button type="button" className={styles.ban} onClick={() => removePlayer(true)}>
                                        <img src={banIcon} alt="Ban" className={styles.icon} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {hasBannedPlayers && (
                <>
                    <hr className={styles.divider} />
                    <h3 className={styles.sectionTitle}>Jogadores Banidos</h3>
                    <div className={styles.playerList}>
                        {banneds.map((banned, index) => 
                            <div key={index} className={styles.banned}>
                                <p className={styles.bannedNickname}>{banned.nickname}</p>
                                <button type="button" className={styles.unban} onClick={() => unban(banned.player_id)}>
                                    <img src={unbanIcon} alt="Unban" className={styles.icon} />
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

            {/* {banneds.map((banned, index) => 
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
} */}