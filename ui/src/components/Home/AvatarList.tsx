import { avatars } from "../../utils/avatars";
import AvatarItem from "./AvatarItem";
import styles from "../../styles/Home/AvatarList.module.css";

interface AvatarListProps {
    onSelectAvatar: (avatar: number) => void;
    selectedAvatar: number;
}

export default function AvatarList({onSelectAvatar, selectedAvatar}: AvatarListProps) {

    return (
        <div className={styles.avatarList}>
            {Object.entries(avatars).map(([id, src]) => (
                <AvatarItem 
                key={id} 
                id={Number(id)}
                avatar={src} 
                onSelect={onSelectAvatar} 
                selected={selectedAvatar === Number(id)} 
                />
            ))}
        </div>
    )
}