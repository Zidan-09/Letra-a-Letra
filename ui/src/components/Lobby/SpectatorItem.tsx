import styles from "../../styles/Lobby/SpectatorItem.module.css";

interface SpectatorItemProps {
    avatar: number;
}

export default function SpectatorItem({ avatar }: SpectatorItemProps) {
    return (
        <div className={styles.item}>
            <img src={`${avatar}`} alt="Avatar" />
        </div>
    )
}