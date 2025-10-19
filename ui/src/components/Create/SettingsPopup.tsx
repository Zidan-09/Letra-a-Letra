import type { GameModes, MovementsEnum } from "../../utils/room_utils";
import { Themes, ThemeTranslations } from "../../utils/themes.ts";
import { useState, useEffect } from "react";
import PowerPopup from "./PowerPopup.tsx";
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
    const [localPowers, setLocalPowers] = useState<MovementsEnum[]>(allowedPowers);
    const [powerPopupOpen, setPowerPopupOpen] = useState(false);

    // Atualiza o estado local sempre que o popup abrir
    useEffect(() => {
        if (isOpen) {
            setLocalTheme(theme);
            setLocalGamemode(gamemode);
            setLocalPowers(allowedPowers);
        }
    }, [isOpen, theme, gamemode, allowedPowers]);

    if (!isOpen) return null;

    const handleBack = () => {
        // Propaga as mudanças antes de fechar
        setTheme(localTheme);
        setGamemode(localGamemode);
        setAllowedPowers(localPowers);
        onClose();
    };

    const gamemodeLabels: Record<GameModes, string> = {
        NORMAL: "NORMAL",
        CRAZY: "MALUCO",
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
                                className={`${styles.button} ${localGamemode === "CRAZY"
                                    ? styles.gamemodeCrazy
                                    : styles.gamemodeNormal
                                    }`}
                                onClick={() =>
                                    setLocalGamemode(
                                        localGamemode === "NORMAL" ? "CRAZY" : "NORMAL"
                                    )
                                }
                            >
                                {gamemodeLabels[localGamemode]}
                            </button>
                        </div>
                    </div>
                </div>

                <PowerPopup
                    isOpen={powerPopupOpen}
                    onClose={() => setPowerPopupOpen(false)}
                    defaultPowers={localPowers}
                    onConfirm={(powers) => setLocalPowers(powers)}
                />
            </div>
        </div>
    );
}
