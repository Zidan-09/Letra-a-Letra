import styles from "../../styles/Room/RoomErrorPopup.module.css";

interface RoomNotFoundPopupProps {
    isOpen: boolean;
    error?: "not_found" | "full_room" | "banned";
    onClose: () => void;
}

export default function RoomErrorPopup({ isOpen, error, onClose }: RoomNotFoundPopupProps) {
    if (!isOpen) return null;

    const message = error === "not_found" ?
    "A sala não foi encontrada" : error === "banned" ?
    "Você foi banido desta sala" : "A sala está cheia";

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={onClose}>
                <h2 onClick={onClose}>{message}</h2>
            </div>
        </div>
    )
}