import { useSocket } from "../../services/socketProvider";
import styles from "../../styles/Game/Cell.module.css";

interface CellProps {
    player_id: string | undefined;
    finded: string | undefined;
    letter?: string;
    onClick: () => void;
}

export default function Cell({ player_id, finded, letter, onClick }: CellProps) {
    const socket = useSocket();

    const className = 
    finded ? 
    finded === socket.id ? 
    styles.findedMe : 
    styles.findedOppo : 
    player_id ? 
    player_id === socket.id ? 
    styles.me : 
    styles.opponent : "";

    return (
        <button 
        className={`${styles.cell} ${className}`} 
        onClick={onClick} 
        type="button"
        translate="no"
        >
            {letter || ""}
        </button>
        );
}
