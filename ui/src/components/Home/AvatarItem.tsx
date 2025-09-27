import styles from "../../styles/Home/AvatarItem.module.css";

interface AvatarItemProps {
    id: number;
    avatar: string;
    onSelect: (avatar: number) => void;
    selected: boolean;
}

export default function AvatarItem({ id, avatar, onSelect, selected }: AvatarItemProps) {
    return (
        <img 
        src={avatar} 
        alt="Avatar" 
        className={`${styles.avatar} ${selected ? styles.selected : ""}`} 
        onClick={() => {onSelect(id)}}
        />
    )
}