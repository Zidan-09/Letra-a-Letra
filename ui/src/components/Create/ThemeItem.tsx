import styles from "../../styles/Create/ThemeItem.module.css";

interface ThemeItemProps {
    theme: string;
    selected: string;
    select: (theme: string) => void;
}

export default function ThemeItem({ theme, selected, select }: ThemeItemProps) {
    return (
        <div className={`${styles.card} ${selected === theme ? styles.selected : styles.theme}`} onClick={() => select(theme)}>
            <h2 className={styles.title}>{theme}</h2>
        </div>
    )
}