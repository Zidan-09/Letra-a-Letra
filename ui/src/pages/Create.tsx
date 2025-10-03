import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../services/socketProvider";
import type { GameModes, MovementsEnum } from "../utils/room_utils";
import { Server } from "../utils/server_utils";
import SettingsPopup from "../components/Create/SettingsPopup";
import iconBack from "../assets/buttons/icon-back.svg";
import iconCreate from "../assets/buttons/icon-create.svg";
import styles from "../styles/Create.module.css";
import iconSettings from "../assets/buttons/icon-settings.svg"

export default function Create() {
    const [roomName, setRoomName] = useState<string>("");
    const [turnTime, setTurnTime] = useState<number>(15);
    const [theme, setTheme] = useState<string>("random");
    const [allowedPowers, setAllowedPowers] = useState<MovementsEnum[]>([]);
    const [gamemode, setGamemode] = useState<GameModes>("NORMAL");
    const [spectators, setSpectators] = useState<boolean>(true);
    const [privateRoom, setPrivate] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [popupOpen, setPopupOpen] = useState<boolean>(false);

    const socket = useSocket();
    const navigate = useNavigate();

    const handleSettings = () => {
        setPopupOpen(true);
    }

    const handleBack = () => {
        return navigate("/");
    }

    const handleCreate = async () => {
        if (!roomName.trim() || loading) return;

        setLoading(true);

        const result = await fetch(`${Server}/room/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                room_name: roomName,
                timer: turnTime,
                allowSpectators: spectators,
                privateRoom: privateRoom,
                player_id: socket.id
            })
        }).then(res => res.json()).then(data => data);

        setLoading(false);

        if (!result.success) return null;

        localStorage.setItem("game", JSON.stringify(result.data));
        return navigate(`/lobby/${result.data.room_id}`);
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.titleContainer}>
                    <h2 className={styles.title}>CRIAR SALA</h2>
                </div>

                <p className={styles.label}>Nome da Sala</p>
                <input 
                type="text" 
                name="name" 
                id="name" 
                placeholder="Insira o nome da sala..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className={styles.input}
                />
                
                <div className={styles.rangeContainer}>
                    <p className={styles.label}>Tempo do Turno</p>

                    <input 
                    type="range" 
                    name="turn" 
                    id="turn" 
                    min="15"
                    max="60"
                    step="1"
                    value={turnTime}
                    onChange={(e) => setTurnTime(Number(e.target.value))}
                    aria-label="turn"
                    className={styles.range}
                    />

                    <span className={styles.timer} translate="no">{turnTime}s</span>
                </div>


                <div className={styles.switchs}>
                    <div className={styles.switchContainer}>
                        <p className={styles.label}>Espectadores</p>
                        <div 
                        className={`${styles.switch} ${spectators ? styles.on : styles.off}`} 
                        onClick={() => setSpectators(s => !s)}
                        >
                            <div className={styles.switchBall}></div>
                            <p className={spectators ? styles.textOn : styles.textOff}>{spectators ? "on" : "off"}</p>
                        </div>
                    </div>

                <div className={styles.switchContainer}>
                    <p className={styles.label}>Config.</p>
                    <button type="button" className={styles.settings} onClick={handleSettings}>
                    <img src={iconSettings} alt="Settings" className={styles.icon1}/>
                    </button>
                </div>


                    <div className={styles.switchContainer}>
                        <p className={styles.label}>Sala Privada</p>
                        <div 
                        className={`${styles.switch} ${privateRoom ? styles.on : styles.off}`}
                        onClick={() => setPrivate(p => !p)} translate="no"
                        >
                            <div className={styles.switchBall}></div>
                            <p className={privateRoom ? styles.textOn : styles.textOff}>{privateRoom ? "on" : "off"}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.buttons}>
                    <button className={`${styles.button} ${styles.back}`} onClick={handleBack} type="button">
                        <img src={iconBack} alt="Create" className={styles.icon} />
                        Voltar
                    </button>

                    <button className={`${styles.button} ${loading ? styles.loading : styles.create}`} onClick={handleCreate} type="button">
                        <img src={iconCreate} alt="Enter" className={styles.icon} />
                        {loading ? "Criando..." : "Criar Sala"}
                    </button>
                </div>
            </div>

            <SettingsPopup 
            theme={theme} 
            allowedPowers={allowedPowers} 
            gamemode={gamemode} 
            setTheme={setTheme}
            setAllowedPowers={setAllowedPowers}
            setGamemode={setGamemode}
            isOpen={popupOpen}
            onClose={() => setPopupOpen(false)}
            />
        </div>
    )
};