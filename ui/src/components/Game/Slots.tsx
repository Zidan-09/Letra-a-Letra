import type { MovementsEnum, Player } from "../../utils/room_utils";
import styles from "../../styles/Lobby/SpectatorsList.module.css";

interface SlotsProps {
    player: Player;
    selectPower: (power: MovementsEnum) => void;
}

export default function Slots({player, selectPower}: SlotsProps) {
    return (
        <div className={styles.panel}>
            <div className={styles.slots}>
                {Array.from({ length: 5 }).map((_, index) => {
                        const power = player.powers[index];

                        return power ? (
                            <div key={index} className={`${styles.slot} ${styles}.${power.rarity}`} 
                            onClick={() => selectPower(power.power)}
                            ></div>
                        ) : (
                            <div key={index} className={`${styles.slot} ${styles.empty}`} 
                            onClick={() => selectPower("REVEAL")}
                            ></div>
                        )
                    })}
            </div>
        </div>
    )
}