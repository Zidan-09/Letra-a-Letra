import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || "random");
  const [turnTime, setTurnTime] = useState<number>(Number(localStorage.getItem("turn_time") || 15));
  const [privateRoom, setPrivateRoom] = useState<boolean>(localStorage.getItem("privateRoom") === "true");

  return (
    <div className="container">
      <h1 className="title">Criar Sala</h1>
      <div className="form">
        <label htmlFor="theme">Tema:</label>
        <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="random">Aleatório</option>
          <option value="tech">Tech</option>
          <option value="fruits">Frutas</option>
          <option value="cities">Cidades</option>
          <option value="animals">Animais</option>
          <option value="colors">Cores</option>
          <option value="sports">Esportes</option>
          <option value="foods">Comidas</option>
          <option value="jobs">Trabalhos</option>
          <option value="nature">Natureza</option>
          <option value="space">Espaço</option>
        </select>

        <label htmlFor="turn_time">Tempo máximo do turno (segundos):</label>
        <input
          type="number"
          id="turn_time"
          min={5}
          max={30}
          value={turnTime}
          onChange={(e) => setTurnTime(Number(e.target.value))}
        />

        <label htmlFor="private_room">Sala privada:</label>
        <input
          type="checkbox"
          id="private_room"
          checked={privateRoom}
          onChange={(e) => setPrivateRoom(e.target.checked)}
        />

        <div className="buttons">
          <button id="back-btn" onClick={() => navigate("/")}>
            Voltar
          </button>
          <button
            id="create-btn"
            onClick={() => {
              const nickname = localStorage.getItem("nickname");
              if (!nickname) {
                alert("Nickname não encontrado, volte para a Home.");
                navigate("/");
                return;
              }

              let tt = turnTime;
              if (isNaN(tt) || tt < 5) tt = 15;
              if (tt > 30) tt = 30;

              localStorage.setItem("action_type", "create");
              localStorage.setItem("theme", theme);
              localStorage.setItem("turn_time", String(tt));
              localStorage.setItem("privateRoom", String(privateRoom));

              navigate("/game");
            }}
          >
            Criar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
