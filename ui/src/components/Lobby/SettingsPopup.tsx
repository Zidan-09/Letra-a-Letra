import { useEffect } from "react";
import styles from "../../styles/Lobby/SettingsPopup.module.css";
import type { Game } from "../../utils/room_utils";

interface SettingsPopupProps {
    isOpen: boolean;
    onClose: () => void;
    room: Game;
}

export default function SettingsPopup({isOpen, onClose, room}: SettingsPopupProps) {

    useEffect(() => {
        if (!isOpen || !room) {

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