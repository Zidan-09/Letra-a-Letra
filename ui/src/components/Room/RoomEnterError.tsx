import styles from "../../styles/Room/RoomErrorPopup.module.css";

interface RoomNotFoundPopupProps {
    isOpen: boolean;
    error?: "not_found" | "full_room";
    onClose: () => void;
}

export default function RoomErrorPopup({ isOpen, error, onClose }: RoomNotFoundPopupProps) {

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={onClose}>
                <h2 onClick={onClose}>{error === "not_found" ? "A sala não foi encontrada" : "A sala está cheia"}</h2>
            </div>
        </div>
    )
}