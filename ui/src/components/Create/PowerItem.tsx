import styles from "../../styles/Create/PowerItem.module.css";
import type { MovementsEnum } from "../../utils/room_utils"
import { PowerData } from "../../utils/powers";


interface PowerItemProps {
    power: MovementsEnum;
    enabled: boolean;
    onToggle: (power: MovementsEnum) => void;
}

export default function PowerItem({ power, enabled, onToggle }: PowerItemProps) {
  const { label, icon } = PowerData[power] || { label: power, icon: "" };
  
  return (
    <div 
        className={`${styles.item} ${enabled ? styles.enabled : styles.disabled}`}
        onClick={() => onToggle(power)}
    >
      <img src={icon} alt={label} className={styles.icon} />
        {/* {icon && <img src={icon} alt={label} className={styles.icon} />} */}
      <p className={styles.powerName}>{label}</p>
    </div>
  );
}