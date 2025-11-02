import { useNavigate } from "react-router-dom";
import { useSocket } from "../../services/socketProvider";
import { useState } from "react";
import ChatPopup from "../Lobby/ChatPopup";
import ConfirmExitPopup from "./ConfirmExitPopup";
import settings from "../../settings.json";
import iconBack from "../../assets/buttons/icon-back.svg";
import iconChat from "../../assets/buttons/icon-chat.svg";
import styles from "../../styles/Game/ExtraButtons.module.css";

interface ExtraButtonsProps {
  room_id: string;
  nickname?: string;
  isOpen: boolean;
  setPopup: () => void;
  onClose: () => void;
  onNewMessage: () => void;
  unreadMessages: number;
}

export default function ExtraButtons({
  room_id,
  nickname,
  isOpen,
  setPopup,
  onClose,
  unreadMessages,
  onNewMessage,
}: ExtraButtonsProps) {
  const socket = useSocket();
  const navigate = useNavigate();

  const [confirmExit, setConfirmExit] = useState(false);

  const handleBack = async () => {
    setConfirmExit(true);
  };

  const confirmLeave = async () => {
    setConfirmExit(false);
    const result = await fetch(
      `${settings.server}/room/${room_id}/players/${socket.id}`,
      {
        method: "DELETE",
      }
    ).then((res) => res.json());

    if (result.success) navigate("/");
  };

  const cancelLeave = () => setConfirmExit(false);

  return (
    <>
      <div className={styles.extraButtons}>
        <button
          type="button"
          className={`${styles.button} ${styles.back}`}
          translate="no"
          onClick={handleBack}
        >
          <img src={iconBack} alt="Icon" className={styles.icon} />
          Sair
        </button>

        <button
          type="button"
          className={`${styles.button} ${styles.chat}`}
          translate="no"
          onClick={setPopup}
        >
          <img src={iconChat} alt="Icon" className={styles.icon} />
          {unreadMessages > 0 && (
            <span className={styles.notificationDot}></span>
          )}
          Chat
        </button>

        <ChatPopup
          room_id={room_id}
          nickname={nickname}
          local="game"
          isOpen={isOpen}
          onClose={onClose}
          onNewMessage={onNewMessage}
        />
      </div>
      <ConfirmExitPopup
        isOpen={confirmExit}
        onConfirm={confirmLeave}
        onCancel={cancelLeave}
      />
    </>
  );
}
