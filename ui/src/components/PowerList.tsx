import PowerItem from "./PowerItem";
import styles from "../styles/Create/PowerList.module.css";
import type { MovementsEnum } from "../utils/room_utils";

interface PowerListProps {
    powers: MovementsEnum[];
    onSelectedPower: (power: MovementsEnum) => void;
    selectedPower: MovementsEnum | null;
}

export default function PowerList({powers}: PowerListProps) {


    return (
        <div className={styles.powerList}>
            <PowerItem />
        </div>
    )
}
