import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Room } from "../../types";

const JoinRoom: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [customRoomId, setCustomRoomId] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    try {
      const res = await fetch("http://localhost:3333/room/getRooms");
      const json = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const roomsData: Room[] = (json.data || []).filter((r: any) => !r.privateRoom);
      setRooms(roomsData);
    } catch (err) {
      console.error("Erro ao buscar salas:", err);
    }
  }

  function selectRoom(roomId: string) {
    setSelectedRoomId(roomId);
  }

  return (
    <div className="container">
      <h1 className="title">Entrar em Sala</h1>

      <button id="custom-code-btn" onClick={() => setShowPopup(true)}>Inserir código personalizado</button>

      {showPopup && (
        <div id="custom-code-popup" className="popup" style={{ display: "flex" }}>
          <div className="popup-content">
            <span id="close-popup" onClick={() => setShowPopup(false)}>&times;</span>
            <input
              type="text"
              id="custom-room-id"
              placeholder="Digite o código da sala"
              value={customRoomId}
              onChange={(e) => setCustomRoomId(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="rooms-panel" id="rooms-panel">
        {rooms.map((r) => (
          <div
            key={r.room_id}
            className={`room-item ${selectedRoomId === r.room_id ? "selected" : ""}`}
            onClick={() => selectRoom(r.room_id)}
          >
            {r.room_id} - Tema: {r.theme} - Jogadores: {r.players?.length || 0}
          </div>
        ))}
      </div>

      <div className="buttons">
        <button id="back-btn" onClick={() => navigate("/")}>Voltar</button>
        <button
          id="join-btn"
          onClick={() => {
            const nickname = localStorage.getItem("nickname");
            if (!nickname) {
              alert("Nickname não encontrado, volte para a Home.");
              navigate("/");
              return;
            }

            const roomId = (customRoomId.trim() || selectedRoomId) ?? "";
            if (!roomId) {
              alert("Selecione uma sala ou insira um código.");
              return;
            }

            localStorage.setItem("room_id", roomId);
            localStorage.setItem("action_type", "join");
            navigate("/game");
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
