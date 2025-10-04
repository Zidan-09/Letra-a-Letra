// import type { MovementsEnum } from "../../utils/room_utils";
// import PowerItem from "./PowerItem";

// interface PowerListProps {
//     selectedPowers: MovementsEnum[];
//     select: (power: MovementsEnum) => void;
// }

// export default function PowerList({ selectedPowers, select }: PowerListProps) {
//     return (
//       <div>
//           {selectedPowers.map((power, index) => (
//               <PowerItem 
//               key={index}
//               power={power} 
//               enabled={true}
//               onToggle={select}
//               />
//           ))}
//       </div>
//     )
// }

import type { MovementsEnum } from "../../utils/room_utils";
import styles from "../../styles/Create/PowerList.module.css";
import PowerItem from "./PowerItem";

interface PowerListProps {
    availablePowers: MovementsEnum[];
    selectedPowers: MovementsEnum[];
    onTogglePower: (power: MovementsEnum) => void;
}

export default function PowerList({ selectedPowers, onTogglePower, availablePowers }: PowerListProps) {
    return (
      <div>
        <div className={styles.powerListContainer}>
          {availablePowers.map((power, index) => (
              <PowerItem 
              key={index}
              power={power} 
              enabled={selectedPowers.includes(power)}
              onToggle={onTogglePower}
              />
          ))}
      </div>
      </div>
    )
}