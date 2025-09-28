import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Server } from "../../utils/server_utils";
import { useSocket } from "../../services/socketProvider";
import InvalidCodePopup from "./InvalidCodePopup";
import iconBack from "../../assets/buttons/icon-back.png";
import iconEnter from "../../assets/buttons/icon-enter.png";
import styles from "../../styles/Room/RoomPopup.module.css";

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RoomPopup({isOpen, onClose}: PopupProps) {
    const [room_id, setRoom_id] = useState("");
    const [isNotValidCode, setInvalidCode] = useState(false);
    const socket = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) {
            setRoom_id("");
        }
    }, [isOpen]);

    const handleBack = () => {
        onClose();
    }

    const handleEnter = async () => {
        if (!room_id.trim()) return;
        
        const valid = await fetch(`${Server}/room/${room_id}`).then(res => res.json()).then(data => data);

        if (!valid.status) {
            return setInvalidCode(true);
        }

        if (valid.data.players.length >= 2) {
            const result = await fetch(`${Server}/room/${room_id}/players`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    spectator: true,
                    player_id: socket.id
                })
            }).then(res => res.json()).then(data => data);

            if (!result.status) return null;

            return navigate(`/lobby/${room_id}`);
        }

        const result = await fetch(`${Server}/room/${room_id}/players`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                spectator: false,
                player_id: socket.id
            })
        }).then(res => res.json()).then(data => data);

        if (!result.stataus) return null;

        return navigate(`/lobby/${room_id}`);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleEnter();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <div className={styles.titlecontainer}>
                    <h2 className={styles.title}>ENTRAR NA SALA</h2>
                </div>
                <div className={styles.inputcontainer}>
                    <p>Inserir Código</p>
                    <input
                    autoFocus
                    type="text"
                    placeholder="Digite o código da sala..."
                    value={room_id}
                    onChange={(e) => setRoom_id(e.target.value)}
                    className={styles.input}
                    onKeyDown={handleKeyDown}
                    />
                </div>
                
                <div className={styles.buttons}>
                    <button className={`${styles.button} ${styles.back}`} onClick={handleBack}>
                        <img src={iconBack} alt="Back" className={styles.icon} />
                        Voltar
                    </button>
                    <button className={`${styles.button} ${styles.enter}`} onClick={handleEnter}>
                        <img src={iconEnter} alt="Enter" className={styles.icon} />
                        Entrar
                    </button>
                </div>
            </div>
            <InvalidCodePopup isOpen={isNotValidCode} onClose={() => setInvalidCode(false)} />
        </div>
    )
}