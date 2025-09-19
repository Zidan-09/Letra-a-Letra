import React, { useState, useEffect } from "react";
import RoomsList from "../components/RoomsList";
import PopupInsertCode from "../components/PopupInsertCode";
import { useNavigate } from "react-router-dom";
import type { Game } from "../utils/room_utils";
import styles from "../styles/Room/Room.module.css";

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Game[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Game | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch("http://localhost:3333/room/getRooms").then(res => res.json()).then(data => data.data);
      setRooms(response);
    } catch (error) {
      console.error(error);
      alert("Não foi possível carregar as salas.");
    }
  };

  const handleEnterRoom = () => {
    if (!selectedRoom) return;
    if (selectedRoom.players.length < 2) {
      navigate(`/game/${selectedRoom.room_id}`);
    } else {
      navigate(`/game/${selectedRoom.room_id}?spectator=true`);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Salas Disponíveis</h2>
        <RoomsList
          rooms={rooms}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
        />
        <div className={styles.buttons}>
          <button className={styles.button} onClick={handleBack}>
            Voltar
          </button>
          <button
            className={styles.button}
            onClick={handleEnterRoom}
            disabled={!selectedRoom}
          >
            {selectedRoom
              ? selectedRoom.players.length < 2
                ? "Entrar Sala"
                : "Entrar como Espectador"
              : "Entrar Sala"}
          </button>
          <button
            className={styles.button}
            onClick={() => setShowPopup(true)}
          >
            Inserir Código
          </button>
        </div>
      </div>

      {showPopup && <PopupInsertCode close={() => setShowPopup(false)} />}
    </div>
  );
};

export default Rooms;