import { useNavigate } from "react-router-dom";
import { useSocket } from "../../services/socketProvider";
import ChatPopup from "../Lobby/ChatPopup";
import settings from "../../settings.json";
import iconBack from "../../assets/buttons/icon-back.svg";
import iconChat from "../../assets/buttons/icon-chat.svg";
import styles from "../../styles/Game/ExtraButtons.module.css";

interface ExtraButtonsProps {
    room_id: string;
    nickname?: string;
    isOpen: boolean;
    setPopup: () => void;
    onClose: () => void;
}

export default function ExtraButtons({ room_id, nickname, isOpen, setPopup, onClose }: ExtraButtonsProps) {
    const socket = useSocket();
    const navigate = useNavigate();

    const handleBack = async () => {
        const result = await fetch(`${settings.server}/room/${room_id}/players/${socket.id}`, {
            method: "DELETE"
        }).then(res => res.json()).then(data => data);

        if (!result.success) return;

        navigate("/");
    }

    return (
        <div className={styles.extraButtons}>
            <button
            type="button"
            className={`${styles.button} ${styles.back}`}
            translate="no"
            onClick={handleBack}
            >
                <img
                src={iconBack}
                alt="Icon"
                className={styles.icon}
                />
                Sair
            </button>

            <button
            type="button"
            className={`${styles.button} ${styles.chat}`}
            translate="no"
            onClick={setPopup}
            >
                <img
                src={iconChat}
                alt="Icon"
                className={styles.icon}
                />
                Chat
            </button>

            <ChatPopup
            room_id={room_id}
            nickname={nickname}
            local="game"
            isOpen={isOpen}
            onClose={onClose}
            />
        </div>
    )
}