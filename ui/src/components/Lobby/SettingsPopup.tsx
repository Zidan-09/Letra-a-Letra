import { useEffect, useState } from "react";
import styles from "../../styles/Lobby/SettingsPopup.module.css";
import type { RoomSettings } from "../../utils/room_utils";
import SettingsForm from "../SettingsForm";

interface SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  roomSettings?: RoomSettings;
  onSave: (settings: RoomSettings) => void;
}

export default function SettingsPopup({
  isOpen,
  onClose,
  roomSettings,
  onSave,
}: SettingsPopupProps) {
  const [settings, setSettings] = useState<RoomSettings>(
    roomSettings || {
      theme: "random",
      gamemode: "NORMAL",
      allowedPowers: ["REVEAL"],
    }
  );

  useEffect(() => {
    if (roomSettings) setSettings(roomSettings);
  }, [roomSettings]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h2>Configurações</h2>

        <SettingsForm settings={settings} onChange={setSettings} />

        <div className={styles.actions}>
          <button onClick={handleSave}>Salvar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}