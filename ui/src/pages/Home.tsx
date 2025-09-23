import type { Player } from "../utils/room_utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../services/socketProvider";
import { Server } from "../utils/server_utils";
import styles from "../styles/Home.module.css";
import logo from "../assets/logo.png";
import iconCreate from "../assets/buttons/icon-create.png";
import iconEnter from "../assets/buttons/icon-enter.png";
import iconHelp from "../assets/buttons/icon-help.png";

export default function Home() {
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();
  const socket = useSocket();

  const handleCreateRoom = async () => {
    if (nickname.trim()) {
      const result = await createPlayer();

      if (
        result.player_id === socket.id
      ) navigate("/create");
    }
  };
  
  const handleEnterRoom = async () => {
    if (nickname.trim()) {
      const result = await createPlayer();

      if (
        result.player_id === socket.id
      ) navigate("/room");
    }
  };

  const handleHelp = () => {
    alert("Instruções de como jogar serão exibidas aqui.");
  };

  const createPlayer = async (): Promise<Player> => {
    const result = await fetch(`${Server}/player/createPlayer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player_id: socket.id,
        nickname: nickname
      })
    }).then(res => res.json()).then(data => data);

    return result.data;
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={logo} alt="Logo Letra a Letra" className={styles.logo} />

        <p className={styles.label}>Nickname</p>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Digite seu Nickname..."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.buttons}>
          <button className={`${styles.button} ${styles.create}`} onClick={handleCreateRoom}>
            <img src={iconCreate} alt="Create" className={styles.icon} />
            Criar Sala
          </button>
          <button className={`${styles.button} ${styles.enter}`} onClick={handleEnterRoom}>
            <img src={iconEnter} alt="Enter" className={styles.icon} />
            Entrar na Sala
          </button>
        </div>

        <button className={`${styles.button} ${styles.help}`} onClick={handleHelp}>
          <img src={iconHelp} alt="Help" className={styles.icon} />
          Como Jogar
        </button>
      </div>
    </div>
  );
}