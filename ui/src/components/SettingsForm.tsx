import { useState, useEffect } from "react";
import PowerList from "../components/PowerList";
import type { RoomSettings, MovementsEnum } from "../utils/room_utils";
import styles from "../styles/SettingsForm.module.css";

const ALL_POWERS: MovementsEnum[] = [
  "BLOCK",
  "UNBLOCK",
  "TRAP",
  "DETECTTRAPS",
  "FREEZE",
  "UNFREEZE",
  "SPY",
  "BLIND",
  "LANTERN",
  "IMMUNITY",
];

interface SettingsFormProps {
  settings: RoomSettings;
  onChange: (settings: RoomSettings) => void;
}

export default function SettingsForm({ settings, onChange }: SettingsFormProps) {
  const [theme, setTheme] = useState(settings.theme);
  const [gameMode, setGameMode] = useState(settings.gamemode);
  const [selectedPowers, setSelectedPowers] = useState<MovementsEnum[]>(settings.allowedPowers);

  useEffect(() => {
    onChange({ theme, gamemode: gameMode, allowedPowers: selectedPowers });
  }, [theme, gameMode, selectedPowers]);

  const handleModeToggle = () => {
    setGameMode((prev) => (prev === "NORMAL" ? "MALUCO" : "NORMAL"));
  };

  const togglePower = (power: MovementsEnum) => {
    setSelectedPowers((prev) =>
      prev.includes(power) ? prev.filter((p) => p !== power) : [...prev, power]
    );
  };

  return (
    <div className={styles.form}>
      {/* Tema */}
      <label htmlFor="theme" className={styles.label}>Tema:</label>
      <select
        name="theme"
        id="theme"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className={styles.themes}
      >
        <option value="random">Aleatório</option>
        <option value="tech">Tecnologia</option>
        <option value="fruits">Frutas</option>
        <option value="cities">Cidades</option>
        <option value="animals">Animais</option>
        <option value="colors">Cores</option>
        <option value="sports">Esportes</option>
        <option value="foods">Comidas</option>
        <option value="jobs">Profissões</option>
        <option value="nature">Natureza</option>
        <option value="space">Espaço</option>
      </select>

      {/* Modo */}
      <div className={styles.modeSelector}>
        <label className={styles.label}>Modo:</label>
        <button
          type="button"
          onClick={handleModeToggle}
          className={`${styles.button1} ${gameMode === "NORMAL" ? styles.modeNormal : styles.modeCrazy}`}
        >
          {gameMode === "NORMAL" ? "NORMAL" : "MALUCO"}
        </button>
      </div>

      {/* Poderes */}
      <fieldset className={styles.powers}>
        <legend className={styles.label}>Poderes permitidos:</legend>
        <PowerList
          availablePowers={ALL_POWERS}
          selectedPowers={selectedPowers}
          onTogglePower={togglePower}
        />
      </fieldset>
    </div>
  );
}