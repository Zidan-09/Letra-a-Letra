import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RoomList from "../components/Room/RoomList";
import type { Game } from "../utils/room_utils";
import settings from "../settings.json";
import { useSocket } from "../services/socketProvider";
import RoomPopup from "../components/Room/RoomPopup";
import iconBack from "../assets/buttons/icon-back.svg";
import iconEnter from "../assets/buttons/icon-enter.svg";
import iconRefresh from "../assets/buttons/icon-refresh.svg";
import styles from "../styles/Room.module.css";
import RoomErrorPopup from "../components/Room/RoomErrorPopup";

export default function Room() {
  const [rooms, setRooms] = useState<Game[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [roomError, setRoomError] = useState<
    "not_found" | "full_room" | "timeout" | "banned" | "room_ban" | undefined
  >(undefined);
  const [onRoomError, setOnRoomError] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [room, setRoom] = useState<Game | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const navigate = useNavigate();
  const socket = useSocket();

  const handleBack = () => {
    return navigate("/");
  };

  const handleEnter = async () => {
    if (!selectedRoom) return;

    const valid = await fetch(`${settings.server}/room/${selectedRoom}`)
      .then((res) => res.json())
      .then((data) => data);

    if (!valid.success) {
      setRoomError("not_found");
      return setOnRoomError(true);
    }

    if (
      valid.data.players.filter(Boolean).length === 2 &&
      valid.data.spectators.filter(Boolean).length === 5
    ) {
      setRoomError("full_room");
      setOnRoomError(true);
      return;
    }

    try {
      const result = await fetch(
        `${settings.server}/room/${selectedRoom}/players`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            spectator: valid.data.players.filter(Boolean).length === 2,
            player_id: socket.id,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => data);

      if (result.message === "banned_player") {
        setRoomError(result.data);
        setOnRoomError(true);
        return;
      }
      console.log(result);

      localStorage.setItem("game", JSON.stringify(result.data.game));
      localStorage.setItem("actual", JSON.stringify(result.data.actual));
      return (result.data.game.status as Game["status"]) === "game_running"
        ? navigate(`/game/${selectedRoom}`)
        : navigate(`/lobby/${selectedRoom}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInsertCode = () => {
    setRoomError(undefined);
    setOnRoomError(false);
    setPopupOpen(true);
  };

  const handleSelectRoom = (room_id: string) => {
    setSelectedRoom(room_id);
    const room = rooms.find((r) => r.room_id === room_id);

    if (!room) return;

    setRoom(room);
  };

  const handleRefresh = async () => {
    setUpdating(true);
    const response = await fetch(`${settings.server}/room`);
    const data: Game[] = await response.json().then((data) => data.data);
    setRooms(data);

    const timeOut = setTimeout(
      () => {
        setUpdating(false);
        clearTimeout(timeOut);
      },
      data.length * 500 > 1000 ? data.length * 500 : 900
    );
  };

  useEffect(() => {
    async function fetchRooms() {
      const response = await fetch(`${settings.server}/room`);
      const data: Game[] = await response.json().then((data) => data.data);
      setRooms(data);
    }

    fetchRooms();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Salas Disponíveis</h1>
          <button
            type="button"
            className={styles.refresh}
            onClick={handleRefresh}
          >
            <img
              src={iconRefresh}
              alt="refresh"
              className={updating ? styles.updating : styles.iconRefresh}
            />
          </button>
        </div>

        <RoomList
          rooms={rooms}
          onSelectRoom={handleSelectRoom}
          selectedRoom={selectedRoom}
        />

        <div className={styles.buttons}>
          <button
            type="button"
            className={`${styles.button} ${styles.back}`}
            onClick={handleBack}
          >
            <img src={iconBack} alt="Back" className={styles.icon} />
            Voltar
          </button>
          {selectedRoom && room && room.players.filter(Boolean).length >= 2 ? (
            <button
              type="button"
              className={`${styles.button} ${styles.spectator}`}
              onClick={() => handleEnter()}
            >
              <img src={iconEnter} alt="Enter" className={styles.icon} />
              Espectar
            </button>
          ) : (
            <button
              type="button"
              className={`${styles.button} ${styles.enter}`}
              onClick={() => handleEnter()}
            >
              <img src={iconEnter} alt="Enter" className={styles.icon} />
              Entrar
            </button>
          )}
        </div>

        <button
          type="button"
          className={`${styles.button} ${styles.code}`}
          onClick={handleInsertCode}
        >
          Inserir Código
        </button>
      </div>

      <RoomPopup
        room_id={selectedRoom}
        setRoomId={setSelectedRoom}
        roomError={roomError}
        onRoomError={onRoomError}
        setRoomError={setRoomError}
        setOnRoomError={setOnRoomError}
        enterRoom={handleEnter}
        isOpen={isPopupOpen}
        onClose={() => {
          setPopupOpen(false);
        }}
      />

      <RoomErrorPopup
        isOpen={onRoomError}
        error={roomError}
        onClose={() => setOnRoomError(false)}
      />
    </div>
  );
}
