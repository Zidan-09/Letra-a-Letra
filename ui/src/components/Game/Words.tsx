import styles from "../../styles/Game/Words.module.css";

interface WordsProps {
    words: string[];
    findeds: string[];
}

export default function Words({ words, findeds }: WordsProps) {
    return (
        <div className={styles.panel}>
            <div className={styles.words}>
                {words.map((word, index) => (
                    word && findeds.includes(word) ?
                    <h2 key={index} className={`${styles.word} ${styles.finded}`}>{word}</h2>
                    :
                    <h2 key={index} className={styles.word}>{word}</h2>
                ))}
            </div>
        </div>
    )
}