import { useEffect } from "react";
import styles from "../../styles/Room/RoomErrorPopup.module.css";

interface RoomNotFoundPopupProps {
  isOpen: boolean;
  error?: "not_found" | "full_room" | "timeout" | "banned" | "room_ban";
  onClose: () => void;
}

export default function RoomErrorPopup({
  isOpen,
  error,
  onClose,
}: RoomNotFoundPopupProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const message =
    error === "not_found"
      ? "A sala não foi encontrada"
      : error === "banned"
      ? "Você foi banido permanentemente"
      : error === "timeout"
      ? "Você foi banido temporariamente"
      : error === "room_ban"
      ? "Você foi banido desta sala"
      : error === "full_room"
      ? "A sala está cheia"
      : "ERROR";

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={onClose}>
        <h2 onClick={onClose}>{message}</h2>
      </div>
    </div>
  );
}
