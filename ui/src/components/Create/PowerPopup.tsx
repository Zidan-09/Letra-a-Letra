import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import iconBack from "../../assets/buttons/icon-back.svg";
import iconConfirm from "../../assets/buttons/icon-create.svg";
import PowerList from "./PowerList";
import styles from "../../styles/Create/PowerPopup.module.css";
import type { MovementsEnum } from "../../utils/room_utils";

interface PowerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPowers?: MovementsEnum[];
}

const ALL_POWERS: MovementsEnum[] = [
  "REVEAL",
  "BLOCK",
  "UNBLOCK",
  "TRAP",
  "DETECTTRAPS",
  "FREEZE",
  "UNFREEZE",
  "SPY",
  "BLIND",
  "LANTERN",
  "IMMUNITY",
];

export default function PowerPopup({ isOpen, onClose, defaultPowers = [] }: PowerPopupProps) {
  const [selectedPowers, setSelectedPowers] = useState<MovementsEnum[]>(defaultPowers);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setSelectedPowers(defaultPowers);
    }
  }, [isOpen, defaultPowers]);

  const handleBack = () => {
    onClose();
  };

  const handleConfirm = () => {
    localStorage.setItem("allowedPowers", JSON.stringify(selectedPowers));
    navigate("/lobby");
  };

  const togglePower = (power: MovementsEnum) => {
    setSelectedPowers((prev) =>
      prev.includes(power) ? prev.filter((p) => p !== power) : [...prev, power]
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.titlecontainer}>
          <h2 className={styles.title}>ESCOLHER PODERES</h2>
        </div>

        <PowerList
          availablePowers={ALL_POWERS}
          selectedPowers={selectedPowers}
          onTogglePower={togglePower}
        />

        <div className={styles.buttons}>
          <button className={`${styles.button} ${styles.back}`} onClick={handleBack}>
            <img src={iconBack} alt="Back" className={styles.icon1} />
            Voltar
          </button>
          <button className={`${styles.button} ${styles.confirm}`} onClick={handleConfirm}>
            <img src={iconConfirm} alt="Confirm" className={styles.icon2} />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
