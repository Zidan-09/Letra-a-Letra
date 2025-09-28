import styles from "../../styles/Create/PowerItem.module.css";
import type {MovementsEnum} from "../../utils/room_utils"

interface PowerItemProps {
    power: MovementsEnum;
    enabled: boolean;
    onToggle: (power: MovementsEnum) => void;
}

export default function PowerItem({power, enabled, onToggle} : PowerItemProps) {
    const handleClick = () => {
        onToggle(power);
    };
    
    return (
        <div className={`${styles.item} ${enabled ? styles.enabled : styles.disabled}`}
        onClick={handleClick}>
            <p className={styles.powerName}>{power}</p>
        </div>
    );
}  