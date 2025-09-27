import AvatarList from "./AvatarList";
import styles from "../../styles/Home/AvatarPopup.module.css"

interface AvatarPopupProps {
    selectedAvatar: number;
    onSelectAvatar: (avatar: number) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function AvatarPopup({ selectedAvatar, onSelectAvatar, isOpen, onClose }: AvatarPopupProps) {

    if (!isOpen) return null;
    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
                <AvatarList selectedAvatar={selectedAvatar} onSelectAvatar={onSelectAvatar}/>
            </div>
        </div>
    )
}