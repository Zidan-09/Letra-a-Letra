import { useEffect } from "react";
import RoomEnterError from "./RoomEnterError";
import iconBack from "../../assets/buttons/icon-back.svg";
import iconEnter from "../../assets/buttons/icon-enter.svg";
import styles from "../../styles/Room/RoomPopup.module.css";

interface PopupProps {
    room_id: string | "";
    setRoomId: (id: string) => void;
    roomError?: "not_found" | "full_room" | "banned";
    onRoomError: boolean;
    setRoomError: (error: "not_found" | "full_room") => void;
    setOnRoomError: (hasError: boolean) => void;
    enterRoom: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function RoomPopup({ room_id, setRoomId, roomError, onRoomError, setOnRoomError, enterRoom, isOpen, onClose}: PopupProps) {

    useEffect(() => {
        if (!isOpen) {
            setRoomId("");
            setOnRoomError(false);
        }
    }, [isOpen]);

    const handleBack = () => {
        onClose();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") enterRoom();
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
                    onChange={(e) => setRoomId(e.target.value)}
                    className={styles.input}
                    onKeyDown={handleKeyDown}
                    />
                </div>
                
                <div className={styles.buttons}>
                    <button 
                    type="button"
                    className={`${styles.button} ${styles.back}`}
                    onClick={handleBack}
                    >
                        <img src={iconBack} alt="Back" className={styles.icon} />
                        Voltar
                    </button>
                    <button
                    type="button"
                    className={`${styles.button} ${styles.enter}`}
                    onClick={() => enterRoom()}
                    >
                        <img src={iconEnter} alt="Enter" className={styles.icon} />
                        Entrar
                    </button>
                </div>
            </div>
            <RoomEnterError isOpen={onRoomError} error={roomError} onClose={() => setOnRoomError(false)} />
        </div>
    )
}