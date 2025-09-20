import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomList from "../components/RoomList";
import type { Game } from "../utils/room_utils";
import styles from "../styles/Room.module.css";
import iconBack from "../assets/icon-back.png";
import iconEnter from "../assets/icon-enter.png";
import iconRefresh from "../assets/icon-refresh.png";

export default function Room() {
  const [rooms, setRooms] = useState<Game[]>([]);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleEnter = () => {
    // Logic to enter a selected room
  };

  const handleInsertCode = () => {
    // Logic to insert a room code
  };


  const handleRefresh = async () => {
    const response = await fetch("http://localhost:3333/api/v1/room/getRooms");
    const data: Game[] = await response.json().then(data => data.data);
    setRooms(data);
  }

  useEffect(() => {
    async function fetchRooms() {
      const response = await fetch("http://localhost:3333/api/v1/room/getRooms");
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

        <RoomList rooms={rooms} />

        <div className={styles.buttons}>
          <button className={`${styles.button} ${styles.back}`} onClick={handleBack}>
            <img src={iconBack} alt="Back" className={styles.icon} />
            Voltar
          </button>

          <button className={`${styles.button} ${styles.enter}`} onClick={handleEnter}>
            <img src={iconEnter} alt="Enter" className={styles.icon} />
            Entrar
            </button>
        </div>

        <button className={`${styles.button} ${styles.code}`} onClick={handleInsertCode}>Inserir Código</button>
      </div>
    </div>
  );
}