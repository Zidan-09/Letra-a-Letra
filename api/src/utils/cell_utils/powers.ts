import { MovementsEnum } from "../board_utils/movementsEnum";
import { PowerRarity } from "./powerRarity";

const commomPowers: { name: MovementsEnum, rarity: PowerRarity.COMMON }[] = [
    { name: MovementsEnum.BLOCK, rarity: PowerRarity.COMMON },
    { name: MovementsEnum.UNBLOCK, rarity: PowerRarity.COMMON },
    { name: MovementsEnum.TRAP, rarity: PowerRarity.COMMON },
    { name: MovementsEnum.DETECTTRAPS, rarity: PowerRarity.COMMON },
]

const rarePowers: { name: MovementsEnum, rarity: PowerRarity.RARE }[] = [
    { name: MovementsEnum.FREEZE, rarity: PowerRarity.RARE },
    { name: MovementsEnum.UNFREEZE, rarity: PowerRarity.RARE },
    { name: MovementsEnum.SPY, rarity: PowerRarity.RARE },
]

const epicPowers: { name: MovementsEnum, rarity: PowerRarity.EPIC }[] = [
    { name: MovementsEnum.BLIND, rarity: PowerRarity.EPIC },
    { name: MovementsEnum.LANTERN, rarity: PowerRarity.EPIC },
]

const legendaryPowers: { name: MovementsEnum, rarity: PowerRarity.LEGENDARY }[] = [
    { name: MovementsEnum.IMMUNITY, rarity: PowerRarity.LEGENDARY },
]

export { commomPowers, rarePowers, epicPowers, legendaryPowers }