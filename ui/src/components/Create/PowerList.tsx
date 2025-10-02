import type { MovementsEnum } from "../../utils/room_utils";
import PowerItem from "./PowerItem";

interface PowerListProps {
    selectedPowers: MovementsEnum[];
    select: (power: MovementsEnum) => void;
}

export default function PowerList({ selectedPowers, select }: PowerListProps) {
    return (
      <div>
          {selectedPowers.map((power, index) => (
              <PowerItem 
              key={index}
              power={power} 
              enabled={true}
              onToggle={select}
              />
          ))}
      </div>
    )
}