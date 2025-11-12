import { useState, useEffect } from "react";
import type { GameModes, MovementsEnum } from "../../utils/room_utils";
import { Themes, ThemeTranslations } from "../../utils/themes.ts";
import PowerList from "./PowerList.tsx";
import iconBack from "../../assets/buttons/icon-back.svg";
import styles from "../../styles/Create/SettingsPopup.module.css";

interface SettingsPopupProps {
  theme: string;
  allowedPowers: MovementsEnum[];
  gamemode: GameModes;
  setTheme: (theme: string) => void;
  setAllowedPowers: (allowedPowers: MovementsEnum[]) => void;
  setGamemode: (gamemode: GameModes) => void;
  isOpen: boolean;
  onClose: () => void;
}

const ALL_POWERS: MovementsEnum[] = [
  "BLOCK",
  "UNBLOCK",
  "TRAP",
  "DETECT_TRAPS",
  "FREEZE",
  "UNFREEZE",
  "SPY",
  "BLIND",
  "LANTERN",
  "IMMUNITY",
];

const modeOrder: GameModes[] = [
  "EASY",
  "NORMAL",
  "HARD",
  "INSANE",
  "CATACLISM",
];

export default function SettingsPopup({
  theme,
  allowedPowers,
  gamemode,
  setTheme,
  setAllowedPowers,
  setGamemode,
  isOpen,
  onClose,
}: SettingsPopupProps) {
  const [localTheme, setLocalTheme] = useState(theme);
  const [localGamemode, setLocalGamemode] = useState(gamemode);
  const [localPowers, setLocalPowers] =
    useState<MovementsEnum[]>(allowedPowers);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setLocalTheme(theme);
      setLocalGamemode(modeOrder.includes(gamemode) ? gamemode : "NORMAL");
      setLocalPowers(allowedPowers);
    }
  }, [isOpen, theme, gamemode, allowedPowers]);

  const togglePower = (power: MovementsEnum) => {
    setLocalPowers((prev) =>
      prev.includes(power) ? prev.filter((p) => p !== power) : [...prev, power]
    );
  };

  if (!isOpen) return null;

  const handleBack = () => {
    setTheme(localTheme);
    setGamemode(localGamemode);
    setAllowedPowers(localPowers);
    onClose();
  };

  const gamemodeLabels: Record<GameModes, string> = {
    NORMAL: "Normal",
    EASY: "Fácil",
    HARD: "Difícil",
    INSANE: "Insano",
    CATACLISM: "Cataclismo",
  };

  const gamemodeStyles: Record<GameModes, string> = {
    NORMAL: styles.gamemodeNormal,
    EASY: styles.gamemodeEasy,
    HARD: styles.gamemodeHard,
    INSANE: styles.gamemodeInsane,
    CATACLISM: styles.gamemodeCataclism,
  };

  const handleModeCycle = () => {
    const currentIndex = modeOrder.indexOf(localGamemode);
    const nextIndex = (currentIndex + 1) % modeOrder.length;
    setLocalGamemode(modeOrder[nextIndex]);
  };

  return (
    <div className={styles.overlay} onClick={handleBack}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <header className={styles.titlecontainer}>
          <button className={styles.back} onClick={handleBack}>
            <img src={iconBack} alt="Back" className={styles.icon} />
          </button>
          <h2 className={styles.title}>Configurações</h2>
        </header>

        <div className={styles.messages}>
          <div className={styles.sideBySide}>
            <div className={styles.settingSection}>
              <p className={styles.labelTheme}>Tema</p>
              <select
                title="Theme"
                className={styles.selectTheme}
                value={localTheme}
                onChange={(e) => setLocalTheme(e.target.value)}
              >
                {Themes.map((t, index) => (
                  <option key={index} value={t}>
                    {ThemeTranslations[t]}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.settingSection}>
              <p className={styles.labelTheme}>Modo</p>
              <button
                className={`${styles.button} ${gamemodeStyles[localGamemode]}`}
                onClick={handleModeCycle}
              >
                {gamemodeLabels[localGamemode]}
              </button>
            </div>
          </div>

          <div className={styles.settingSection}>
            <p className={styles.labelTheme}>Poderes</p>
          </div>

          <div className={styles.powerListWrapper}>
            <PowerList
              availablePowers={ALL_POWERS}
              selectedPowers={localPowers}
              onTogglePower={togglePower}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
