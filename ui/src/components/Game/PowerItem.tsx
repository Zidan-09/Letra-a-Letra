import type { MovementsEnum } from "../../utils/room_utils";
import { powers, border } from "../../utils/powers";
import styles from "../../styles/Game/PowerItem.module.css";

interface PowerItemProps {
    idx: number;
    movement: MovementsEnum;
    selected: boolean;
    selectMove: (movement: MovementsEnum) => void;
    selectIdx: (idx: number | undefined) => void;
}

export default function PowerItem({ idx, movement, selected, selectMove, selectIdx }: PowerItemProps) {
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
        </div>
    )
}