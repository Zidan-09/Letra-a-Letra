import { useState, useEffect } from "react";
import { useSocket } from "../services/socketProvider";
import { useNavigate } from "react-router-dom";
import { Server } from "../utils/server_utils";
import type { Game } from "../utils/room_utils";
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
    const [room, setRoom] = useState<Game | undefined>(undefined);
    const socket = useSocket();
    const navigate = useNavigate();
    const [isChatOpen, setChatOpen] = useState(false);
    const [isSettingsOpen, setSettingsOpen] = useState(false);

    socket.on("player_joined", (room) => {
        setRoom(room);
    })

    socket.on("message", (data) => {
        console.log(data);
    })

    useEffect(() => {
        const game = localStorage.getItem("game");
        console.log(game)

        if (!game) {
            navigate("/create");
            return;
        }

        return setRoom(JSON.parse(game).data);
    }, [])

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

    const handlePlay = () => {
        navigate("/game");
    }
    
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <p>CÓDIGO DA SALA</p>
                <div className={styles.top}>
                    <button className={`${styles.button} ${styles.settings}`} onClick={handleSettings}>
                        <img src={iconSettings} alt="Settings" className={styles.icons}/>
                    </button>

                    <div className={styles.codecontainer}>
                        <h2 className={styles.code}>{room?.room_id}</h2>
                    </div>

                    <button className={`${styles.button} ${styles.chat}`} onClick={handleChat}>
                        <img src={iconChat} alt="Chat" className={styles.icons} />
                    </button>
                </div>
                {room && (
                    <>
                        <section className={styles.players}>
                            <p>JOGADORES NA SALA</p>
                            <PlayerList players={room.players}/>
                        </section>

                        <section className={styles.spectators}>
                            <p>ESPECTADORS</p>
                            <SpectatorsList spectators={room!.spectators} />
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
            {room && (
                <SettingsPopup isOpen={isSettingsOpen} onClose={() => {setSettingsOpen(false)}} room={room}/>   
            )}
            
            <ChatPopup isOpen={isChatOpen} onClose={() => {setChatOpen(false)}}/>
        </div>
    )
}