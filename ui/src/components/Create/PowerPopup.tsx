import { useEffect, useState } from "react";
import iconBack from "../../assets/buttons/icon-back.svg";
import PowerList from "./PowerList";
import styles from "../../styles/Create/PowerPopup.module.css";
import type { MovementsEnum } from "../../utils/room_utils";

interface PowerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPowers?: MovementsEnum[];
  onConfirm: (powers: MovementsEnum[]) => void;
}

const ALL_POWERS: MovementsEnum[] = [
  "BLOCK",
  "UNBLOCK",
  "TRAP",
  "DETECT_TRAPS",
  "FREEZE",
  "UNFREEZE",
  "SPY",
  "BLIND",
  "LANTERN",
  "IMMUNITY",
];

export default function PowerPopup({
  isOpen,
  onClose,
  defaultPowers = [],
  onConfirm,
}: PowerPopupProps) {
  const [selectedPowers, setSelectedPowers] =
    useState<MovementsEnum[]>(defaultPowers);

  useEffect(() => {
    if (!isOpen) {
      setSelectedPowers(defaultPowers);
    }
  }, [isOpen, defaultPowers]);

  const togglePower = (power: MovementsEnum) => {
    setSelectedPowers((prev) =>
      prev.includes(power) ? prev.filter((p) => p !== power) : [...prev, power]
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => e.stopPropagation()}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.titlecontainer}>
          <button
            className={styles.back}
            onClick={() => {
              onConfirm(selectedPowers);
              onClose();
            }}
          >
            <img src={iconBack} alt="Back" className={styles.icon} />
          </button>
          <h2 className={styles.title}>ESCOLHER PODERES</h2>
        </div>

        <PowerList
          availablePowers={ALL_POWERS}
          selectedPowers={selectedPowers}
          onTogglePower={togglePower}
        />
      </div>
    </div>
  );
}
