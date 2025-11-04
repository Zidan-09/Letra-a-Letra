import type { MovementsEnum } from "./room_utils";
import block from "../assets/powers/icon-block.png";
import unblock from "../assets/powers/icon-unblock.png";
import freeze from "../assets/powers/icon-freeze.png";
import unfreeze from "../assets/powers/icon-unfreeze.png";
import trap from "../assets/powers/icon-trap.png";
import detect_traps from "../assets/powers/icon-detecttraps.png";
import spy from "../assets/powers/icon-spy.png";
import blind from "../assets/powers/icon-blind.png";
import lantern from "../assets/powers/icon-lantern.png";
import immunity from "../assets/powers/icon-imunity.png";

export function border(movement: MovementsEnum) {
  const commons: MovementsEnum[] = ["BLOCK", "UNBLOCK", "TRAP", "DETECT_TRAPS"];
  const rare: MovementsEnum[] = ["FREEZE", "UNFREEZE", "SPY"];
  const epic: MovementsEnum[] = ["BLIND", "LANTERN"];
  const legendary: MovementsEnum[] = ["IMMUNITY"];

  if (commons.includes(movement)) return "common";
  if (rare.includes(movement)) return "rare";
  if (epic.includes(movement)) return "epic";
  if (legendary.includes(movement)) return "legendary";

  return "common";
}

export const powers: Record<MovementsEnum, string> = {
  BLOCK: block,
  UNBLOCK: unblock,
  FREEZE: freeze,
  UNFREEZE: unfreeze,
  TRAP: trap,
  DETECT_TRAPS: detect_traps,
  SPY: spy,
  BLIND: blind,
  LANTERN: lantern,
  IMMUNITY: immunity,
  REVEAL: "NONE",
};

export const PowerData: Record<MovementsEnum, { label: string; icon: string }> =
  {
    BLOCK: { label: "Bloquear", icon: block },
    UNBLOCK: { label: "Desbloquear", icon: unblock },
    TRAP: { label: "Armadilha", icon: trap },
    DETECT_TRAPS: { label: "Detectar Armadilhas", icon: detect_traps },
    FREEZE: { label: "Congelar", icon: freeze },
    UNFREEZE: { label: "Descongelar", icon: unfreeze },
    SPY: { label: "Espionar", icon: spy },
    BLIND: { label: "Cegar", icon: blind },
    LANTERN: { label: "Lanterna", icon: lantern },
    IMMUNITY: { label: "Imunidade", icon: immunity },
    REVEAL: { label: "Revelar", icon: "" },
  };
