import type { MovementsEnum, Power } from "../../utils/room_utils";
import PowerItem from "./PowerItem";
import styles from "../../styles/Game/Slots.module.css";

interface SlotsProps {
  playerPowers: Power[];
  selected: number | undefined;
  selectMove: (movement: MovementsEnum) => void;
  selectMoveIdx: (idx: number | undefined) => void;
  applyEffect: () => void;
  discardPower: () => void;
}

export default function Slots({
  playerPowers,
  selected,
  selectMove,
  selectMoveIdx,
  applyEffect,
  discardPower,
}: SlotsProps) {
  if (!playerPowers) return;

  return (
    <div className={styles.slotsContainer}>
      {Array.from({ length: 5 }).map((_, index) =>
        playerPowers[index] ? (
          <PowerItem
            key={index}
            idx={index}
            movement={playerPowers[index].power}
            type={playerPowers[index].type}
            selected={selected === index}
            selectMove={selectMove}
            selectIdx={selectMoveIdx}
            applyEffect={applyEffect}
            discardPower={discardPower}
          />
        ) : (
          <div key={index} className={styles.empty}></div>
        )
      )}
    </div>
  );
}
