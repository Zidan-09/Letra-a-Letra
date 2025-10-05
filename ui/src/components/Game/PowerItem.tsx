import type { MovementsEnum } from "../../utils/room_utils";
import { powers, border } from "../../utils/powers";
import styles from "../../styles/Game/PowerItem.module.css";

interface PowerItemProps {
    idx: number;
    movement: MovementsEnum;
    selected: boolean;
    selectMove: (movement: MovementsEnum) => void;
    selectIdx: (idx: number) => void;
}

export default function PowerItem({ idx, movement, selected, selectMove, selectIdx }: PowerItemProps) {
    const handleSelectMove = () => {
        selectIdx(idx);
        selectMove(movement);
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