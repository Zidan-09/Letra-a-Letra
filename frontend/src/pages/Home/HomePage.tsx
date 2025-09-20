import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [nickname, setNickname] = useState<string>(localStorage.getItem("nickname") || "");
  const navigate = useNavigate();

  function saveNickname(): string | null {
    const nick = nickname.trim();
    if (!nick) {
      alert("Digite um nickname primeiro!");
      return null;
    }
    localStorage.setItem("nickname", nick);
    return nick;
  }

  return (
    <div className="container">
      <h1 className="title">Letra a Letra</h1>

      <div className="form">
        <input
          type="text"
          id="nickname"
          placeholder="Digite seu nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />

        <div className="buttons">
          <button
            id="create-room"
            onClick={() => {
              if (!saveNickname()) return;
              navigate("/create");
            }}
          >
            Criar Uma Sala
          </button>
          <button
            id="join-room"
            onClick={() => {
              if (!saveNickname()) return;
              navigate("/join");
            }}
          >
            Entrar Em Sala
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
