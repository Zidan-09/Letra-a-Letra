import type { MovementsEnum } from "../../utils/room_utils";
import { PowerDescriptions } from "../../utils/powerDescriptions";
import styles from "../../styles/Game/PowerDescription.module.css";

interface PowerDescriptionProps {
  power: MovementsEnum;
  isSelected: boolean;
}

export default function PowerDescription({
  power,
  isSelected,
}: PowerDescriptionProps) {
  const pDescription = PowerDescriptions.find((p) => p.power === power);
  const pWarning = pDescription?.warning;

  if (!isSelected) return null;

  return (
    <div className={styles.container}>
      <p className={styles.description}>{pDescription?.description}</p>
      <p className={styles.warning}>{pWarning ? "Nota:" + pWarning : null}</p>
    </div>
  );
}
