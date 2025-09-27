import styles from "../../styles/Lobby/SpectatorItem.module.css";
import { avatars } from "../../utils/avatars";

interface SpectatorItemProps {
    avatar: number;
}

export default function SpectatorItem({ avatar }: SpectatorItemProps) {
    return (
        <img src={avatars[avatar]} alt="Avatar" className={styles.avatar} />
    )
}