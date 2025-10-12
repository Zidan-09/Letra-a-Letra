import { Themes } from "./themesEnum";
import themesJson from "../../settings/themes.json";

export function selectTheme(theme: Themes): string[] {
    if (theme !== Themes.RANDOM) {
        const arrays = Object.values(themesJson[theme]);
        if (arrays.length > 0) {
            const randomArray = arrays[Math.floor(Math.random() * arrays.length)];
            if (randomArray && randomArray.length > 0) return randomArray;
        }
    }

    const allItems: string[][] = Object.values(themesJson).map(Object.values).flat();

    if (allItems.length > 0) {
        const randomArray = allItems[Math.floor(Math.random() * allItems.length)]!;
        return randomArray;
    }   

    return ["backend", "frontend", "database", "software", "hardware"];
}
