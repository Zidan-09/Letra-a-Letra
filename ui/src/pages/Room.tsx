import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomList from "../components/Room/RoomList";
import type { Game } from "../utils/room_utils";
import { Server } from "../utils/server_utils";
import { useSocket } from "../services/socketProvider";
import RoomPopup from "../components/Room/RoomPopup";
import iconBack from "../assets/buttons/icon-back.svg";
import iconEnter from "../assets/buttons/icon-enter.svg";
import iconRefresh from "../assets/buttons/icon-refresh.svg";
import styles from "../styles/Room.module.css";

export default function Room() {
    const [rooms, setRooms] = useState<Game[]>([]);
    const [spectator, setSpectator] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [room, setRoom] = useState<Game | null>(null);
    const navigate = useNavigate();
    const socket = useSocket();

    const handleBack = () => {
        return navigate("/");
    };

    const joinSpectator = () => {
        const room = rooms.find(r => r.room_id === selectedRoom);

        if (!room) return;

        if (room.players.length >= 2) {
            setSpectator(true);
        }
    }

    const handleEnter = async () => {
        const room_id = localStorage.getItem("room_id");

        if (!room_id) {
            return navigate("/");
        }

        async function enterRoom() {
            const data = await fetch(`${Server}/room/${room_id}/players`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    spectator: spectator,
                    player_id: socket.id
                })
            }).then(res => res.json()).then(data => data);

            return data;
        }

        const game = await enterRoom();
        localStorage.setItem("game", JSON.stringify(game.data));

        navigate(`/lobby/${room_id}`);
    };

    const handleInsertCode = () => {
        setPopupOpen(true);
    };

    const handleSelectRoom = (room_id: string) => {
        setSelectedRoom(room_id);
        const room = rooms.find(r => r.room_id === room_id);

        if (!room) return;

        setRoom(room);
        joinSpectator();
    }

    const handleRefresh = async () => {
        const response = await fetch(`${Server}/room`);
        const data: Game[] = await response.json().then(data => data.data);
        setRooms(data);
    }

    useEffect(() => {
        async function fetchRooms() {
            const response = await fetch(`${Server}/room`);
            const data: Game[] = await response.json().then(data => data.data);
            setRooms(data);
        }

        fetchRooms();
    }, []);

  return (
      <div className={styles.container}>
          <div className={styles.card}>
              <div className={styles.titleRow}>
                  <h1 className={styles.title}>Salas Disponíveis</h1>
                  <button className={styles.refresh} onClick={handleRefresh}>
                      <img src={iconRefresh} alt="refresh" className={styles.iconRefresh}/>
                  </button>
              </div>

              <RoomList rooms={rooms} onSelectRoom={handleSelectRoom} selectedRoom={selectedRoom} />

              <div className={styles.buttons}>
                  <button className={`${styles.button} ${styles.back}`} onClick={handleBack}>
                      <img src={iconBack} alt="Back" className={styles.icon} />
                      Voltar
                  </button>
                  {selectedRoom && room && room.players.length >= 2 ? (
                      <button className={`${styles.button} ${styles.spectator}`} onClick={handleEnter}>
                          <img src={iconEnter} alt="Enter" className={styles.icon} />
                          Espectar
                      </button>
                  ) : (
                      <button className={`${styles.button} ${styles.enter}`} onClick={handleEnter}>
                          <img src={iconEnter} alt="Enter" className={styles.icon} />
                          Entrar
                      </button>
                  )}
              </div>

                  <button className={`${styles.button} ${styles.code}`} onClick={handleInsertCode}>Inserir Código</button>
          </div>
          <RoomPopup isOpen={isPopupOpen} onClose={() => {setPopupOpen(false)}}/>
        </div>
    );
}