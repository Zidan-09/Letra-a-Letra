import type { CellUpdate, Player } from "../../../utils/room_utils";
import styles from "../../../styles/Game/Powers/BlindOverlay.module.css";

interface BlindOverlayProps {
  p1: Player;
  x: number;
  y: number;
  cells: CellUpdate[];
}

export default function BlindOverlay({ p1, x, y, cells }: BlindOverlayProps) {
  if (!p1.blind.active) return;

  const isHided = cells.some((c) => c.x === x && c.y === y);
  if (!isHided) return null;

  return <div className={styles.overlay}></div>;
}
