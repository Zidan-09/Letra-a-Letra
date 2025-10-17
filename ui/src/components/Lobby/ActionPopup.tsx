import { useEffect } from "react";
import styles from "../../styles/Lobby/ActionPopup.module.css";

interface ActionPopupProps {
  type: "kick" | "ban";
  onClose: () => void;
}

export default function ActionPopup({ type, onClose }: ActionPopupProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000); // Fecha após 4 segundos
    return () => clearTimeout(timer);
  }, [onClose]);

  const isBan = type === "ban";
  const title = isBan ? "Você foi banido da sala" : "Você foi removido da sala";
  const message = isBan
    ? "O dono da sala te baniu permanentemente."
    : "O dono da sala te removeu da partida.";

  return (
    <div className={styles.overlay}>
      <div className={`${styles.popup} ${isBan ? styles.ban : styles.kick}`}>
        <h2>{title}</h2>
        <p>{message}</p>
      </div>
    </div>
  );
}
