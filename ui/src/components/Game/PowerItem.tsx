import type { MovementsEnum } from "../../utils/room_utils";
import { powers, border } from "../../utils/powers";
import styles from "../../styles/Game/PowerItem.module.css";

interface PowerItemProps {
    idx: number;
    movement: MovementsEnum;
    type: "manipulation" | "effect";
    selected: boolean;
    selectMove: (movement: MovementsEnum) => void;
    selectIdx: (idx: number | undefined) => void;
    applyEffect: () => void;
}

export default function PowerItem({ idx, movement, type, selected, selectMove, selectIdx, applyEffect }: PowerItemProps) {
    const handleSelectMove = () => {
        const isSelected = !selected;

        selectIdx(isSelected ? idx : undefined);
        selectMove(isSelected ? movement : "REVEAL");
    }

    const borderColor = border(movement);

    return (
        <div className={`${styles.power} ${styles[borderColor]} ${selected ? styles.selected : ""}`} onClick={handleSelectMove}>
            <img 
            src={powers[movement]} 
            alt="icon" 
            className={styles.icon}
            />

            <span 
            className={`${styles.label} ${selected ? styles.visible : ""}`}
            >{movement}</span>

            {selected && type === "effect" && (
                <div
                className={styles.useButton}
                onClick={() => applyEffect()}
                >
                    <p>{">"}</p>
                </div>
            )}
        </div>
    )
}