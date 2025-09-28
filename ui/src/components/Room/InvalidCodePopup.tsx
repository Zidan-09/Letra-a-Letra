import styles from "../../styles/Room/InvalidCodePopup.module.css";

interface InvalidCodePopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function InvalidCodePopup({ isOpen, onClose }: InvalidCodePopupProps) {

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={onClose}>
                <h2 onClick={onClose}>Código Inválido!</h2>
            </div>
        </div>
    )
}