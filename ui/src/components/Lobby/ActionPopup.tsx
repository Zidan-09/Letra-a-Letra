import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Lobby/ActionPopup.module.css";

interface ActionPopupProps {
    type: "kick" | "ban" | undefined;
    onClose: () => void;
}

export default function ActionPopup({ type, onClose }: ActionPopupProps) {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") handleBack();
        };

        if (type) window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [type]);

    const handleBack = () => {
        onClose();
        navigate("/room");
    };

    if (type === undefined) return;

    const isBan = type === "ban";
    const title = isBan ? "Você foi banido da sala" : "Você foi removido da sala";
    const message = isBan
        ? "O dono da sala te baniu permanentemente."
        : "O dono da sala te removeu da partida.";

    return (
        <div className={styles.overlay} onClick={handleBack}>
            <div className={`${styles.popup} ${isBan ? styles.ban : styles.kick}`}>
                <h2>{title}</h2>
                <p>{message}</p>
            </div>
        </div>
    );
}
