export const Themes = {
    RANDOM: "random",
    TECH: "tech",
    FRUITS: "fruits",
    CITIES: "cities",
    ANIMALS: "animals",
    COLORS: "colors",
    SPORTS: "sports",
    FOODS: "foods",
    JOBS: "jobs",
    NATURE: "nature",
    SPACE: "space",
} as const;

export type Theme = typeof Themes[keyof typeof Themes];