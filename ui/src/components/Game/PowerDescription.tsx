import type { MovementsEnum } from "../../utils/room_utils";
import { PowerDescriptions } from "../../utils/powerDescriptions";
import styles from "../../styles/Game/PowerDescription.module.css";

interface PowerDescriptionProps {
  power: MovementsEnum;
}

export default function PowerDescription({
  power,
}: PowerDescriptionProps) {
  if (power === "REVEAL") return null;
  
  const pDescription = PowerDescriptions.find((p) => p.power === power);
  if (!pDescription) return null;
  
  const pWarning = pDescription?.warning;

  return (
    <div className={styles.container}>
      <p className={styles.description}>{pDescription?.description}</p>
      <p className={styles.warning}>{pWarning ? "Nota: " + pWarning : null}</p>
    </div>
  );
}
