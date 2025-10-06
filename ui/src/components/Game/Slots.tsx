import type { MovementsEnum, Power } from "../../utils/room_utils";
import PowerItem from "./PowerItem";
import styles from "../../styles/Game/Slots.module.css";

interface SlotsProps {
    playerPowers: Power[];
    selected: number | undefined;
    selectMove: (movement: MovementsEnum) => void;
    selectMoveIdx: (idx: number | undefined) => void;
}

export default function Slots({ playerPowers, selected, selectMove, selectMoveIdx }: SlotsProps) {
    if (!playerPowers) return;

    return (
        <div className={styles.slotsContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
                playerPowers[index] ? (
                    <PowerItem
                    key={index}
                    idx={index}
                    movement={playerPowers[index].power}
                    selected={selected === index}
                    selectMove={selectMove}
                    selectIdx={selectMoveIdx}
                    />
                ) : (
                    <div
                    key={index}
                    className={styles.empty}
                    >
                    </div>
                )
            ))}
        </div>
    )
}