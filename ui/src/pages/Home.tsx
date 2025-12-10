import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../services/socketProvider";
import settings from "../settings.json";
import { avatars } from "../utils/avatars";
import type { Player } from "../utils/room_utils";
import AvatarPopup from "../components/Home/AvatarPopup";
import Footer from "../components/Footer";
import logo from "../assets/logo.svg";
import iconCreate from "../assets/buttons/icon-create.svg";
import iconEnter from "../assets/buttons/icon-enter.svg";
import iconMenu from "../assets/buttons/icon-menu.svg";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<number>(1);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();
  const socket = useSocket();

  const handleCreateRoom = async () => {
    if (nickname.trim()) {
      const result = await createPlayer();

      if (result.player_id === socket.id) return navigate("/create");
    }
  };

  const handleEnterRoom = async () => {
    if (nickname.trim()) {
      const result = await createPlayer();

      if (result.player_id === socket.id) return navigate("/room");
    }
  };

  const handleMenu = () => {
    alert("Instruções de como jogar serão exibidas aqui.");
  };

  const handleAvatarPopupOpen = () => {
    setPopupOpen(true);
  };

  const handleSelectAvatar = (avatar: number) => {
    setSelectedAvatar(avatar);
    setPopupOpen(false);
  };

  const createPlayer = async (): Promise<Player> => {
    const result = await fetch(`${settings.server}/player`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        player_id: socket.id,
        nickname: nickname,
        avatar: selectedAvatar,
      }),
    })
      .then((res) => res.json())
      .then((data) => data);

    return result.data;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={logo} alt="Logo Letra a Letra" className={styles.logo} />

        <p className={styles.label}>Selecione um Avatar < br/> e Nickname</p>

        <div className={styles.inputs}>
          <img
            src={avatars[selectedAvatar]}
            alt="Avatar"
            className={styles.avatar}
            onClick={handleAvatarPopupOpen}
          />

          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Digite seu Nickname..."
              value={nickname}
              maxLength={10}
              onChange={(e) => setNickname(e.target.value.slice(0, 10))}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.buttons}>
          <button
            className={`${styles.button} ${styles.create}`}
            onClick={handleCreateRoom}
            type="button"
          >
            <img src={iconCreate} alt="Create" className={styles.icon} />
            Criar Sala
          </button>
          <button
            className={`${styles.button} ${styles.enter}`}
            onClick={handleEnterRoom}
            type="button"
          >
            <img src={iconEnter} alt="Enter" className={styles.icon} />
            Juntar-se
          </button>
        </div>
      </div>
      <button className={styles.menu} onClick={handleMenu}>
        <img src={iconMenu} alt="Menu" className={styles.iconMenuButton} />
      </button>
      <AvatarPopup
        selectedAvatar={selectedAvatar}
        onSelectAvatar={handleSelectAvatar}
        isOpen={isPopupOpen}
        onClose={() => setPopupOpen(false)}
      />

      <Footer />
    </div>
  );
}