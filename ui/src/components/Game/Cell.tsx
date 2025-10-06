import { useSocket } from "../../services/socketProvider";
import styles from "../../styles/Game/Cell.module.css";

interface CellProps {
    player_id: string | undefined;
    letter?: string;
    onClick: () => void;
}

export default function Cell({ player_id, letter, onClick }: CellProps) {
    const socket = useSocket();

  return (
      <button 
      className={`${styles.cell} ${player_id ? player_id === socket.id ? styles.me : styles.opponent : ""}`} 
      onClick={onClick} 
      type="button"
      translate="no"
      >
          {letter || ""}
      </button>
    );
}
