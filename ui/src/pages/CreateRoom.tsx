import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/CreateRoom.module.css";
import { Themes } from "../utils/themes";
import type { Theme } from "../utils/themes";

interface RoomSettings {
  nickname: string;
  theme: Theme;
  private: boolean;
}

const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nickname = (location.state as { nickname: string })?.nickname || "";

  const [selectedTheme, setSelectedTheme] = useState<Theme>(Themes.RANDOM);
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleCreate = () => {
    if (!nickname.trim()) {
      alert("Nickname inválido");
      return;
    }

    setLoading(true);
    const roomSettings: RoomSettings = {
      nickname,
      theme: selectedTheme,
      private: isPrivate,
    };

    navigate("/game", { state: roomSettings });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Criar Sala</h2>

        <div className={styles.field}>
          <label>Seleção de Tema:</label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as Theme)}
          >
            {Object.values(Themes).map((theme) => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label>
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            Sala Privada
          </label>
        </div>

        <div className={styles.buttons}>
          <button className={styles.button} onClick={handleBack} disabled={loading}>
            Voltar
          </button>
          <button className={styles.button} onClick={handleCreate} disabled={loading}>
            {loading ? "Criando..." : "Criar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;