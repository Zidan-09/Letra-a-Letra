import type { GameModes } from "../../utils/room_utils";
import styles from "../../styles/Create/GamemodeSelector.module.css"; 

interface GamemodeSelectorProps {
  currentMode: GameModes;
  onChange: (newMode: GameModes) => void;
}

const modeOrder: GameModes[] = [
  "EASY",
  "NORMAL",
  "HARD",
  "INSANE",
  "CATACLISM",
];

const gamemodeLabels: Record<GameModes, string> = {
  EASY: "Fácil",
  NORMAL: "Normal",
  HARD: "Difícil",
  INSANE: "Insano",
  CATACLISM: "Cataclismo",
};

export default function GamemodeSelector({ currentMode, onChange }: GamemodeSelectorProps) {

  const gamemodeStyles: Record<GameModes, string> = {
    EASY: styles.gamemodeEasy,
    NORMAL: styles.gamemodeNormal,
    HARD: styles.gamemodeHard,
    INSANE: styles.gamemodeInsane,
    CATACLISM: styles.gamemodeCataclism,
  };

  const handleModeCycle = () => {
    const currentIndex = modeOrder.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modeOrder.length;
    onChange(modeOrder[nextIndex]);
  };

  return (
    <button
      className={`${styles.button} ${gamemodeStyles[currentMode]}`}
      onClick={handleModeCycle}
    >
      {gamemodeLabels[currentMode]}
    </button>
  );
}