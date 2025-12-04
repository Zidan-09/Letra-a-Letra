import { useState } from "react";
import { Themes, ThemeTranslations } from "../../utils/themes";
import styles from "../../styles/Create/ThemeSelector.module.css";

interface ThemeSelectorProps {
  currentTheme: string;
  setTheme: (theme: string) => void;
}

export default function ThemeSelector({ currentTheme, setTheme }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelect = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (themeKey: string) => {
    setTheme(themeKey);
    setIsOpen(false);
  };

  return (
    <div className={styles.selectorContainer} onClick={toggleSelect}>
      <div className={styles.selectedDisplay}>
        <span className={styles.label}>{ThemeTranslations[currentTheme]}</span>        
      </div>

      {isOpen && (
        <div className={styles.optionsList} onClick={(e) => e.stopPropagation()}>
          {Themes.map((themeKey) => (
            <div
              key={themeKey}
              onClick={() => handleSelect(themeKey)}
              className={`${styles.option} ${
                currentTheme === themeKey ? styles.activeOption : ""
              }`}
            >
              {ThemeTranslations[themeKey]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}