import { useSocket } from "../../../services/socketProvider";
import styles from "../../../styles/Game/Powers/BlockOverlay.module.css";

interface BlockOverlayProps {
  blocked: boolean;
  blocked_by?: string;
  remaining?: number;
}

export default function BlockOverlay({ blocked, remaining, blocked_by }: BlockOverlayProps) {
  const socket = useSocket();
  
  if (!blocked || remaining === undefined || !blocked_by) return null;

  const isMine = socket.id === blocked_by;

  return (
    <div className={`${styles.overlay} ${blocked_by === socket.id ? styles.p1 : styles.p2}`}>
      <div className={styles.progress}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={
              remaining <= 3 - index
                ? isMine
                  ? styles.p1Stage
                  : styles.p2Stage
                : styles.emptyStage
            }
          ></div>
        ))}
      </div>
    </div>
  );
}