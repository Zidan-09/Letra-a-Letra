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
    isOpen: boolean;
    onClose: () => void;
}


export default function SettingsPopup({ theme, allowedPowers, gamemode, setTheme, setAllowedPowers, setGamemode, isOpen, onClose }: SettingsPopupProps) {
    
    const handleBack = () => {
            onClose();
        };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
    <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <header className={styles.titlecontainer}>
            
            <h2 className={styles.title}>Configurações</h2>
        </header>
        
         <div className={styles.themes}>
            <p className={styles.label}>Temas</p>
            <ThemeList selectedTheme={theme} selectTheme={setTheme} />
        </div>
{/*
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
        </div> */}
        <div className={styles.buttons}>
                    <button className={`${styles.button} ${styles.back}`} onClick={handleBack}>
                        <img src={iconBack} alt="Back" className={styles.icon} />
                        Voltar
                    </button>
                    {/* <button className={`${styles.button} ${styles.enter}`} onClick={handleEnter}>
                        <img src={iconEnter} alt="Enter" className={styles.icon} />
                        Entrar
                    </button> */}
                </div>
    </div>
</div>

    )
}