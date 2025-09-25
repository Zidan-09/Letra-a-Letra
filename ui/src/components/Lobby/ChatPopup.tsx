import { useEffect } from "react";
import styles from "../../styles/Lobby/ChatPopup.module.css";

interface ChatPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChatPopup({ isOpen, onClose }: ChatPopupProps) {
    useEffect(() => {
        if (!isOpen) {

        }
    }, [isOpen]);
    
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup}>

            </div>
        </div>
    )
}