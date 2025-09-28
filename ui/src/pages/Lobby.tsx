import { useState, useEffect } from "react";
import { useSocket } from "../services/socketProvider";
import { useNavigate } from "react-router-dom";
import { Server } from "../utils/server_utils";
import type { Game, RoomSettings } from "../utils/room_utils";
import PlayerList from "../components/Lobby/PlayerList";
import SettingsPopup from "../components/Lobby/SettingsPopup";
import ChatPopup from "../components/Lobby/ChatPopup";
import SpectatorsList from "../components/Lobby/SpectatorsList";
import iconBack from "../assets/buttons/icon-back.png";
import iconPlay from "../assets/buttons/icon-play.png";
import iconSettings from "../assets/buttons/icon-settings.png";
import iconChat from "../assets/buttons/icon-chat.png";
import styles from "../styles/Lobby.module.css";

export default function Lobby() {
    const [room, setRoom] = useState<Game | null>(null);
    const [roomSettings, setRoomSettings] = useState<RoomSettings| null>(null);
    const socket = useSocket();
    const navigate = useNavigate();
    const [isChatOpen, setChatOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        const game = localStorage.getItem("game");

        setRoom(JSON.parse(game!).data);

        if (!socket) return;

        socket.on("player_joined", (updatedRoom) => {
            setRoom(updatedRoom);
        });

        socket.on("player_left", (updatedRoom) => {
            setRoom(updatedRoom);
        });

        return () => {
            socket.off("player_joined");
            socket.off("player_left");
        };

    }, [socket])

    const handleChat = () => {
        setChatOpen(true);
    }

    const handleSettings = () => {
        setSettingsOpen(true);
    }

    const handleBack = () => {
        async function leaveRoom() {
            await fetch(`${Server}/room/${room?.room_id}/players/${socket.id}`, {
                method: "DELETE"
            }).then(res => res.json()).then(data => { console.log(data) })
        }

        leaveRoom();

        navigate("/create");
    }

    const handlePlay = async () => {
        if (room!.players.length < 2 || !roomSettings) return;

        const result = await fetch(`${Server}/game/${room?.room_id}/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                theme: roomSettings.theme,
                gamemode: roomSettings.gamemode,
                allowedPowers: roomSettings.allowedPowers
            })
        }).then(res => res.json()).then(data => data.data);

        if (!result.status) return;

        navigate("/game");
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <p>CÓDIGO DA SALA</p>
                <div className={styles.top}>
                    <button className={styles.settings} onClick={handleSettings}>
                        <img src={iconSettings} alt="Settings" className={styles.icons}/>
                    </button>

                    <div className={styles.codecontainer}>
                        <h2 className={styles.code}>{room?.room_id}</h2>
                    </div>

                    <button className={styles.chat} onClick={handleChat}>
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
                    <button onClick={handleBack} className={`${styles.button} ${styles.back}`}>
                        <img src={iconBack} alt="Back" className={styles.icon}/>
                        Sair
                    </button>
                    <button onClick={handlePlay} className={`${styles.button} ${styles.play}`}>
                        <img src={iconPlay} alt="Play" className={styles.icon} />
                        Jogar
                    </button>
                </div>
            </div>
            {room && roomSettings && (
                <SettingsPopup
                isOpen={isSettingsOpen}
                onClose={() => {setSettingsOpen(false)}}
                roomSettings={roomSettings}
                onSave={setRoomSettings}
                />   
            )}
            
            <ChatPopup isOpen={isChatOpen} onClose={() => {setChatOpen(false)}}/>
        </div>
    )
}