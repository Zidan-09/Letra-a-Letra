import { useRef, useEffect, useState } from "react";
import { useSocket } from "../../services/socketProvider";
import type { Message, Player } from "../../utils/room_utils";
import iconBack from "../../assets/buttons/icon-back.svg";
import iconSend from "../../assets/buttons/icon-send.svg";
import styles from "../../styles/ChatPopup.module.css";
import ChatPlayersPopup from "./ChatPlayersPopup";

interface ChatPopupProps {
    room_id: string | undefined;
    nickname: string | undefined;
    local: "lobby" | "game";
    creator: string | undefined;
    players?: Player[];
    selectedPlayer: string | undefined;
    selectPlayer: (player: string) => void;
    remove: (ban: boolean) => void;
    unban: () => void;
    isOpen: boolean;
    onClose: () => void;
    onNewMessage: () => void;
}

export default function ChatPopup({ room_id, nickname, local, creator, players, selectedPlayer, selectPlayer, remove, unban, isOpen, onClose, onNewMessage }: ChatPopupProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [myMessage, setMyMessage] = useState<string>("");
    const [isChatPlayersOpen, setChatPlayersOpen] = useState<boolean>(false);
    const endRef = useRef<HTMLDivElement>(null);
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (message: Message) => {
            setMessages(prev => [...prev, message]);
            onNewMessage()
        }

        socket.on("message", handleMessage);

        return () => {
            socket.off("message", handleMessage);
        }

    }, [socket, onNewMessage]);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (!socket || !room_id || !nickname || !myMessage.trim()) return;

        socket.emit("message", {
            room_id: room_id,
            from: nickname,
            message: myMessage
        });


        setMyMessage("");
    }

    if (!isOpen) return null;

    return (
        <div className={local === "lobby" ? styles.overlayLobby : styles.overlayGame } onClick={onClose}>
            <div className={styles.popup} onClick={(e) => e.stopPropagation()}> 
                <div className={styles.header}>
                    <div className={styles.button} onClick={onClose}>
                        <img
                        src={iconBack}
                        alt="Back"
                        className={styles.icon}
                        />
                    </div>
                    <h2 className={styles.titleChat}>Chat</h2>

                    {local === "lobby" && creator === nickname ? (
                        <button
                        className={styles.chatPlayers}
                        >Jogadores</button>
                    ) : (
                        <div className={styles.space}></div>
                    )}    
                </div>

                <div className={styles.messages}>
                    {messages.map((message, index) => (
                        message.from === nickname ? (
                            <p
                            key={index}
                            className={`${styles.m} ${styles.my}`}><span className={styles.me}>{message.from}</span>: {message.message}
                            </p>
                        ) : (
                            <p
                            key={index}
                            className={styles.m}><span className={styles.others}>{message.from}</span>: {message.message}
                            </p>
                        )
                    ))}

                    <div ref={endRef} />

                </div>

                <div className={styles.sendContainer}>
                    <textarea
                    placeholder="Digite sua mensagem..."
                    className={styles.message}
                    value={myMessage}
                    onChange={(e) => setMyMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    />
                    <div className={styles.send}>
                        <img 
                        src={iconSend} 
                        alt="Send"
                        className={styles.icon}
                        onClick={sendMessage}
                        />
                    </div>
                </div>
            </div>

            <ChatPlayersPopup
            players={players}
            isOpen={isChatPlayersOpen}
            onClose={() => setChatPlayersOpen(false)}
            selected={selectedPlayer}
            select={selectPlayer}
            removePlayer={remove}
            unban={unban}
            />
        </div>
    )
}