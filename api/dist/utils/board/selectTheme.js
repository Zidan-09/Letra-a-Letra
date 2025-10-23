"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectTheme = selectTheme;
const themesEnum_1 = require("./themesEnum");
const themes_json_1 = __importDefault(require("../../settings/themes.json"));
function selectTheme(theme) {
    if (theme !== themesEnum_1.Themes.RANDOM) {
        const arrays = Object.values(themes_json_1.default[theme]);
        if (arrays.length > 0) {
            const randomArray = arrays[Math.floor(Math.random() * arrays.length)];
            if (randomArray && randomArray.length > 0)
                return randomArray;
        }
    }
    const allItems = Object.values(themes_json_1.default).map(Object.values).flat();
    if (allItems.length > 0) {
        const randomArray = allItems[Math.floor(Math.random() * allItems.length)];
        return randomArray;
    }
    return ["backend", "frontend", "database", "software", "hardware"];
}
//# sourceMappingURL=selectTheme.js.map