// import PowerItem from "./PowerItem";
// import styles from "../styles/Create/PowerList.module.css";
// import type { MovementsEnum } from "../utils/room_utils";

// interface PowerListProps {
//     powers: MovementsEnum[];
//     onSelectedPower: (power: MovementsEnum) => void;
//     selectedPower: MovementsEnum | null;
// }

// export default function PowerList({powers}: PowerListProps) {


//     return (
//         <div className={styles.powerList}>
//             <PowerItem />
//         </div>
//     )
// }

{/*                                                */}

import PowerItem from "./PowerItem";
import styles from "../../styles/Create/PowerList.module.css";
import type { MovementsEnum } from "../../utils/room_utils";

interface PowerListProps {
  availablePowers: MovementsEnum[];
  selectedPowers: MovementsEnum[];
  onTogglePower: (power: MovementsEnum) => void;
}

export default function PowerList({ availablePowers, selectedPowers, onTogglePower }: PowerListProps) {
  return (
    <div className={styles.list}>
      {availablePowers.length === 0 ? (
        <div className={styles.emptyMessage}>Nenhum poder disponível</div>
      ) : (
        availablePowers.map((power, index) => (
          <PowerItem
            key={index}
            power={power}
            enabled={selectedPowers.includes(power)}
            onToggle={onTogglePower}
          />
        ))
      )}
    </div>
  );
}
