import { Themes } from "../../utils/themes.ts";
import ThemeItem from "./ThemeItem.tsx";
import styles from "../../styles/Create/ThemeList.module.css";

interface ThemeListProps {
  selectedTheme: string;
  selectTheme: (theme: string) => void;
}

export default function ThemeList({
  selectedTheme,
  selectTheme,
}: ThemeListProps) {
  return (
    <div className={styles.themes}>
      {Themes.map((theme, index) => (
        <ThemeItem
          key={index}
          theme={theme}
          selected={selectedTheme}
          select={selectTheme}
        />
      ))}
    </div>
  );
}
