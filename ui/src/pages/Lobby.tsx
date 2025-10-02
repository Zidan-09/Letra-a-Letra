import { useState, useEffect } from "react";
import { useSocket } from "../services/socketProvider";
import { useNavigate } from "react-router-dom";
import { Server } from "../utils/server_utils";
import type { Game, GameModes, MovementsEnum, RoomSettings } from "../utils/room_utils";
import PlayerList from "../components/Lobby/PlayerList";
import ChatPopup from "../components/Lobby/ChatPopup";
import SpectatorsList from "../components/Lobby/SpectatorsList";
import iconBack from "../assets/buttons/icon-back.svg";
import iconPlay from "../assets/buttons/icon-play.svg";
import iconSettings from "../assets/buttons/icon-settings.svg";
import iconChat from "../assets/buttons/icon-chat.svg";
import styles from "../styles/Lobby.module.css";
import SettingsPopup from "../components/Create/SettingsPopup";

export default function Lobby() {
    const [room, setRoom] = useState<Game | null>(null);
    const socket = useSocket();
    const navigate = useNavigate();
    const [isChatOpen, setChatOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);

    const [theme, setTheme] = useState<string>("");
    const [allowedPowers, setAllowedPowers] = useState<MovementsEnum[]>([]);
    const [gamemode, setGamemode] = useState<GameModes>("NORMAL");

    useEffect(() => {
        const game = localStorage.getItem("game");
        const settings = localStorage.getItem("settings");

        if (!game || !settings) {
            navigate("/");
            return;
        };

        setRoom(JSON.parse(game));
        const settingsData: RoomSettings = JSON.parse(settings)
        
        setTheme(settingsData.theme);
        setGamemode(settingsData.gamemode as GameModes);
        setAllowedPowers(settingsData.allowedPowers);

        if (!socket) return;

        socket.on("player_joined", (updatedRoom) => {
            setRoom(updatedRoom);
        });

        socket.on("player_left", (updatedRoom) => {
            setRoom(updatedRoom);
        });

        socket.on("turned_player", (updatedRoom) => {
            setRoom(updatedRoom);
        });

        socket.on("turned_spectator", (updatedRoom) => {
            setRoom(updatedRoom);
        });

        return () => {
            socket.off("player_joined");
            socket.off("player_left");
            socket.off("turned_player");
            socket.off("turned_spectator");
        };

    }, [socket])

    const handleChat = () => {
        setChatOpen(true);
    }

    const handleSettings = () => {
        setSettingsOpen(true);
    }

    const handleBack = async () => {
        async function leaveRoom() {
            await fetch(`${Server}/room/${room?.room_id}/players/${socket.id}`, {
                method: "DELETE"
            }).then(res => res.json()).then(data => data);
        };

        await leaveRoom();

        navigate("/");
    }

    const handlePlay = async () => {
        if (!room || room.players.length < 2 || !theme || !gamemode || !allowedPowers) return null;

        const result = await fetch(`${Server}/game/${room.room_id}/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                theme: theme,
                gamemode: gamemode,
                allowedPowers: allowedPowers
            })
        }).then(res => res.json()).then(data => data.data);

        if (!result.status) return null;

        return navigate(`/game/${room.room_id}`);
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <p>CÓDIGO DA SALA</p>
                <div className={styles.top}>
                    <button className={styles.settings} onClick={handleSettings} type="button">
                        <img src={iconSettings} alt="Settings" className={styles.icons}/>
                    </button>

                    <div className={styles.codecontainer}>
                        <h2 className={styles.code}>{room?.room_id}</h2>
                    </div>

                    <button className={styles.chat} onClick={handleChat} type="button">
                        <img src={iconChat} alt="Chat" className={styles.icons} />
                    </button>
                </div>
                {room && (
                    <>
                        <section className={styles.players}>
                            <p>JOGADORES NA SALA</p>
                            <PlayerList room={room} updateRoom={setRoom} />
                        </section>

                        <section className={styles.spectators}>
                            <p>ESPECTADORS</p>
                            <SpectatorsList room={room} updateRoom={setRoom} />
                        </section>
                    </>
                )}
                

                <div className={styles.buttons}>
                    <button onClick={handleBack} className={`${styles.button} ${styles.back}`} type="button">
                        <img src={iconBack} alt="Back" className={styles.icon}/>
                        Sair
                    </button>
                    <button onClick={handlePlay} className={`${styles.button} ${styles.play}`} type="button">
                        <img src={iconPlay} alt="Play" className={styles.icon} />
                        Jogar
                    </button>
                </div>
            </div>
            {theme && gamemode && allowedPowers && (
                <SettingsPopup 
                theme={theme}
                setTheme={() => setTheme}
                gamemode={gamemode}
                setGamemode={() => setGamemode}
                allowedPowers={allowedPowers}
                setAllowedPowers={() => setAllowedPowers}
                popupOpen={isSettingsOpen}
                closePopup={() => setSettingsOpen}
                />
            )}
            
            <ChatPopup isOpen={isChatOpen} onClose={() => {setChatOpen(false)}}/>
        </div>
    )
}