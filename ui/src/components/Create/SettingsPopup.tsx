import type { GameModes, MovementsEnum } from "../../utils/room_utils";
import { Themes, ThemeTranslations } from "../../utils/themes.ts";
import { useState } from "react";
import PowerPopup from "./PowerPopup.tsx";
import iconBack from "../../assets/buttons/icon-back.svg";
import styles from "../../styles/Create/SettingsPopup.module.css";
// import GamemodeList from "./GamemodeList";
// import ThemeList from "./ThemeList";

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
    const [powerPopupOpen, setPowerPopupOpen] = useState(false)
    
    if (!isOpen) return null;

  const handleBack = () => {
    onClose();
  };

  const gamemodeLabels: Record<GameModes, string> = {
    NORMAL: "NORMAL",
    CRAZY: "MALUCO",
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <header className={styles.titlecontainer}>
        <button
            className={styles.back}
            onClick={handleBack}
          >
            <img src={iconBack} alt="Back" className={styles.icon} />
            
          </button>
          <h2 className={styles.title}>Configurações</h2>
        </header>
<div className={styles.messages}>

 <div className={styles.settingSection}>
          <p className={styles.labelTheme}>Tema</p>
          <select
            className={styles.selectTheme}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {Themes.map((t, index) => (
              <option key={index} value={t}>
                {ThemeTranslations[t]}
              </option>
            ))}
          </select>
        </div>

<div className={styles.sideBySide}>
 <div className={styles.settingSection}>
            <p className={styles.label}>Poderes</p>
            <button
                className={styles.controlButtonP}
            onClick={() => setPowerPopupOpen(true)}
          >
            Selecionar
          </button>
        </div>

 <div className={styles.settingSection}>
          <p className={styles.label}>Modo</p>
          <button
            className={`${styles.button} ${gamemode == "CRAZY" ? styles.gamemodeCrazy : styles.gamemodeNormal}`}
            onClick={() =>
              setGamemode(gamemode === "NORMAL" ? "CRAZY" : "NORMAL")
            }
          >
            {gamemodeLabels[gamemode]}
          </button>
        </div>
          </div>
          </div>
        <PowerPopup
          isOpen={powerPopupOpen}
          onClose={() => setPowerPopupOpen(false)}
          defaultPowers={allowedPowers}
          onConfirm={(powers)=>{setAllowedPowers(powers)}}
          />
          </div>
          </div>
  );
}
