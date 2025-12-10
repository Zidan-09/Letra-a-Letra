import type { Player } from "../../../utils/room_utils";
import styles from "../../../styles/Game/Powers/BlockOverlay.module.css";

interface BlockOverlayProps {
  p1: Player;
  blocked_by?: string;
  remaining?: number;
}

export default function BlockOverlay({
  p1,
  remaining,
  blocked_by,
}: BlockOverlayProps) {
  if (remaining === undefined || !blocked_by) return null;

  const isMine = p1.player_id === blocked_by;

  return (
    <div
      className={`${styles.overlay} ${
        blocked_by === p1.player_id ? styles.p1 : styles.p2
      }`}
      onClick={(e) => {
        if (isMine) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
      style={{
        pointerEvents: isMine ? "auto" : "none",
        cursor: isMine ? "default" : "pointer",
      }}
    >
      <div className={styles.progress}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className={
              remaining <= 2 - index
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