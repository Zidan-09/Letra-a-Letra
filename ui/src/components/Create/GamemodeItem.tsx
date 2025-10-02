import type { GameModes } from "../../utils/room_utils";
import styles from "../../styles/Create/GamemodeItem.module.css";

interface GamemodeItemProps {
  gamemode: GameModes;
  selected: GameModes;
  select: (gm: GameModes) => void;
}

export default function GamemodeItem({ gamemode, selected, select }: GamemodeItemProps) {
  return (
    <div 
      className={`${styles.card} ${selected === gamemode ? styles.selected : ""}`}
      onClick={() => select(gamemode)}
    >
      <h2 className={styles.title}>{gamemode}</h2>
    </div>
  )
}