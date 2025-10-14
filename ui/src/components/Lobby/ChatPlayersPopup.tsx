import type { Player } from "../../utils/room_utils";

interface ChatPlayersPopupProps {
    players?: Player[] | undefined;
    isOpen: boolean;
    selected: string | undefined;
    select: (player_id: string) => void;
    unban: () => void;
    onClose: () => void;
    removePlayer: (ban: boolean) => void;
}

export default function ChatPlayersPopup({ players, isOpen, onClose, removePlayer}: ChatPlayersPopupProps) {
    if (!isOpen || !players) return;

    return (
        <div onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}>
                {players.filter(Boolean).map((player, index) => 
                    <div>
                        <p
                        key={index}
                        >{player.nickname}</p>
                        <div>
                            <button
                            onClick={() => removePlayer(false)}
                            >
                                Remover
                            </button>

                            <button
                            onClick={() => removePlayer(true)}
                            >
                                Banir
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}