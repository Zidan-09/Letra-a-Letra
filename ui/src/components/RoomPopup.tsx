import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import iconBack from "../assets/buttons/icon-back.png";
import iconEnter from "../assets/buttons/icon-enter.png";
import styles from "../styles/Room/RoomPopup.module.css";

interface PopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RoomPopup({isOpen, onClose}: PopupProps) {
    const [room_id, setRoom_id] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (!isOpen) {
            setRoom_id("");
        }
    }, [isOpen]);

    const handleBack = () => {
        onClose();
    }

    const handleEnter = () => {
        if (room_id.trim()) {
            navigate("/lobby")
            localStorage.setItem("room_id", room_id);
        }
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
        </div>
    )
}