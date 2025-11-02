import styles from "../../styles/Lobby/PlayerItem.module.css";
import { avatars } from "../../utils/avatars";

interface PlayerItemProps {
  avatar: number;
  nickname: string;
}

export default function PlayerItem({ avatar, nickname }: PlayerItemProps) {
  return (
    <div className={styles.item}>
      <img src={avatars[avatar]} alt="Avatar" className={styles.avatar} />
      <p className={styles.nickname}>{nickname}</p>
    </div>
  );
}
