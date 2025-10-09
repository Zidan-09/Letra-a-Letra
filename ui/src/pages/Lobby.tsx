import { useState, useEffect } from "react";
import { useSocket } from "../services/socketProvider";
import { useNavigate } from "react-router-dom";
import settings from "../settings.json";
import type { Game, GameModes, MovementsEnum, RoomSettings, StartData } from "../utils/room_utils";
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
    const [creator, setCreator] = useState<string>();
    const [isChatOpen, setChatOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);
    const socket = useSocket();
    const navigate = useNavigate();

    const [theme, setTheme] = useState<string>("random");
    const [allowedPowers, setAllowedPowers] = useState<MovementsEnum[]>(["REVEAL"]);
    const [gamemode, setGamemode] = useState<GameModes>("NORMAL");

    useEffect(() => {
        const game = localStorage.getItem("game");
        const settings = localStorage.getItem("settings");

        if (!game || !settings) {
            navigate("/");
            return;
        };
        
        const gameData: Game = JSON.parse(game);
        const settingsData: RoomSettings = JSON.parse(settings)
        
        setRoom(gameData);
        setTheme(settingsData.theme);
        setGamemode(settingsData.gamemode as GameModes);
        setAllowedPowers(settingsData.allowedPowers);

        const creatorData = [...gameData.players, ...gameData.spectators].filter(Boolean).find(c => c.nickname === gameData.created_by);

        if (!creatorData) {
            return;
        };

        setCreator(creatorData.player_id);

        if (!socket) return;

        socket.on("game_started", (startData: StartData) => {
            const { words, room } = startData;

            localStorage.setItem("words", JSON.stringify(words));
            localStorage.setItem("game", JSON.stringify(room));

            navigate(`/game/${room.room_id}`);
        });
        
        socket.on("player_joined", (updatedRoom: Game) => {
            setRoom({ ...updatedRoom, players: [...updatedRoom.players], spectators: [...updatedRoom.spectators] });
        });

        socket.on("player_left", (updatedRoom: Game) => {
            setRoom({ ...updatedRoom, players: [...updatedRoom.players], spectators: [...updatedRoom.spectators] });
        });

        socket.on("role_changed", (updatedRoom: Game) => {
            setRoom({ ...updatedRoom, players: [...updatedRoom.players], spectators: [...updatedRoom.spectators] });
        });


        return () => {
            socket.off("player_joined");
            socket.off("player_left");
            socket.off("role_changed");
            socket.off("game_started");
        };

    }, [socket]);

    const handleChat = () => {
        setChatOpen(true);
    }

    const handleSettings = () => {
        setSettingsOpen(true);
    }

    const handleBack = async () => {
        async function leaveRoom() {
            const result = await fetch(`${settings.server}/room/${room?.room_id}/players/${socket.id}`, {
                method: "DELETE"
            }).then(res => res.json()).then(data => data);

            return result;
        };

        const result = await leaveRoom();

        if (!result.success) return null;

        return navigate("/");
    }

    const handlePlay = async () => {
        if (!room || room.players.filter(Boolean).length < 2 || !theme || !gamemode || !allowedPowers) return null;

        const result = await fetch(`${settings.server}/game/${room.room_id}/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                theme: theme,
                gamemode: "CRAZY",
                allowedPowers: ["REVEAL", "TRAP", "DETECT_TRAPS"]
            })
        }).then(res => res.json()).then(data => data);

        if (!result.success) return null;
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
                            <PlayerList room={room} />
                        </section>

                        <section className={styles.spectators}>
                            <p>ESPECTADORES</p>
                            <SpectatorsList room={room} />
                        </section>

                        <div className={styles.buttons}>
                            <button onClick={handleBack} className={`${styles.button} ${styles.back}`} type="button">
                                <img src={iconBack} alt="Back" className={styles.icon}/>
                                Sair
                            </button>

                            {socket && creator && socket.id === creator && (
                                <button onClick={handlePlay} className={`${styles.button} ${room.players.filter(Boolean).length >= 2 ? styles.play : styles.disabled}`} type="button">
                                    <img src={iconPlay} alt="Play" className={styles.icon} />
                                    Jogar
                                </button>
                            )}
                        </div>
                    </>
                )}

            </div>
            {theme && gamemode && allowedPowers && socket && creator && socket.id === creator && (
                <SettingsPopup 
                theme={theme}
                setTheme={setTheme}
                gamemode={gamemode}
                setGamemode={setGamemode}
                allowedPowers={allowedPowers}
                setAllowedPowers={setAllowedPowers}
                isOpen={isSettingsOpen}
                onClose={() => setSettingsOpen(false)}
                />
            )}
            {room && (
                <ChatPopup
                room_id={room?.room_id}
                nickname={[...room.players, ...room.spectators].filter(Boolean).find(p => p.player_id === socket.id)?.nickname}
                isOpen={isChatOpen}
                onClose={() => {setChatOpen(false)}}
                />
            )}
        </div>
    )
}