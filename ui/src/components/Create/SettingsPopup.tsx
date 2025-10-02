import type { GameModes, MovementsEnum } from "../../utils/room_utils";
import ThemeList from "./ThemeList";
import PowerList from "./PowerList";
import GamemodeList from "./GamemodeList";
import iconBack from "../../assets/buttons/icon-back.svg";
import styles from "../../styles/Create/SettingsPopup.module.css";

interface SettingsPopupProps {
    theme: string;
    allowedPowers: MovementsEnum[];
    gamemode: GameModes;
    setTheme: (theme: string) => void;
    setAllowedPowers: (allowedPowers: MovementsEnum[]) => void;
    setGamemode: (gamemode: GameModes) => void;
    popupOpen: boolean;
    closePopup: () => void;
}

export default function SettingsPopup({ theme, allowedPowers, gamemode, setTheme, setAllowedPowers, setGamemode, popupOpen, closePopup }: SettingsPopupProps) {

    if (!popupOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.popup}>
                <header>
                    <img src={iconBack} alt="Back" onClick={closePopup}/>
                    <h2>Configurações</h2>
                </header>
                
                <div className={styles.themes}>
                    <p className={styles.label}>Temas</p>
                    <ThemeList selectedTheme={theme} selectTheme={setTheme} />
                </div>

                <div className={styles.allowedPowers}>
                    <p className={styles.label}>Poderes</p>
                    <PowerList 
                    selectedPowers={allowedPowers}
                    select={() => setAllowedPowers}      
                    />
                </div>

                <div className={styles.gamemodes}>
                    <p className={styles.label}>Modos</p>
                    <GamemodeList 
                    gamemode={gamemode} 
                    selectGamemode={() => setGamemode} 
                    />
                </div>
            </div>
        </div>
    )
}