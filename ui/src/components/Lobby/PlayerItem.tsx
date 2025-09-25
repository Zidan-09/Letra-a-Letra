import styles from "../../styles/Lobby/PlayerItem.module.css";
import avatara from "../../assets/avatar/avatar-1.png"

interface PlayerItemProps {
    avatar: number;
    nickname: string;
}

export default function PlayerItem({ avatar, nickname }: PlayerItemProps) {
    return (
        <div className={styles.item}>
            <img src={avatara} alt="Avatar" className={styles.avatar}/>
            <p className={styles.nickname}>{nickname}</p>
        </div>
    )
}