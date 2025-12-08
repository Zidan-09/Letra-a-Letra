import { useState } from "react";
import { createPortal } from "react-dom";
import type { MovementsEnum } from "../../utils/room_utils";
import { powers, border } from "../../utils/powers";
import trash from "../../assets/buttons/icon-trash.svg";
import { powerNamesTranslations } from "../../utils/room_utils";
import PowerDescription from "./PowerDescription";
import styles from "../../styles/Game/PowerItem.module.css";

interface PowerItemProps {
  idx: number;
  movement: MovementsEnum;
  type: "manipulation" | "effect";
  selected: boolean;
  selectMove: (movement: MovementsEnum) => void;
  selectIdx: (idx: number | undefined) => void;
  applyEffect: () => void;
  discardPower: () => void;
}

export default function PowerItem({
  idx,
  movement,
  type,
  selected,
  selectMove,
  selectIdx,
  applyEffect,
  discardPower,
}: PowerItemProps) {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [hover, setHover] = useState(false);
  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 551;

  const handleSelectMove = () => {
    const isSelected = !selected;
    selectIdx(isSelected ? idx : undefined);
    selectMove(isSelected ? movement : "REVEAL");
    setHover(true);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile || !selected) return;
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile || !selected || touchStartY === null) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY;

    const maxDrag = 60;
    const limitedDeltaY = Math.max(-maxDrag, Math.min(maxDrag, deltaY));

    e.currentTarget.style.transform = `translateY(${limitedDeltaY}px) scale(1.05)`;
    e.currentTarget.style.transition = "none";
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile || touchStartY === null) return;

    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - touchStartY;

    e.currentTarget.style.transform = "";
    e.currentTarget.style.transition = "transform 0.2s ease";

    if (deltaY < -50) {
      if (type === "effect") {
        applyEffect();
        selectIdx(undefined);
        selectMove("REVEAL");
      } else {
      }
    } else if (deltaY > 50) {
      discardPower();
      selectIdx(undefined);
      selectMove("REVEAL");
    }

    setTouchStartY(null);
  };

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  const borderColor = border(movement);

  return (
    <div
      className={`${styles.power} ${styles[borderColor]} ${
        selected ? styles.selected : ""
      }`}
      onClick={handleSelectMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {selected && (
        <div className={styles.discard} onClick={discardPower}>
          <img src={trash} alt="Trash" className={styles.trash} />
        </div>
      )}

      <img
      src={powers[movement]}
      alt="icon"
      className={styles.icon}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      />

      <span
      className={`${styles.label} ${selected ? styles.visible : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      >
        {powerNamesTranslations[movement]}
      </span>

      {selected && type === "effect" && (
        <div className={styles.useButton} onClick={() => applyEffect()}>
          <p>{">"}</p>
        </div>
      )}

      {hover && createPortal(
        <PowerDescription power={movement} />,
        document.body
      )}
    </div>
  );
}
