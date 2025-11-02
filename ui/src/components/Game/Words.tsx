import styles from "../../styles/Game/Words.module.css";
import type { CompletedWord } from "../../utils/room_utils";
import { useSocket } from "../../services/socketProvider";

interface WordsProps {
  words: string[];
  findeds: CompletedWord[];
}

export default function Words({ words, findeds }: WordsProps) {
  if (!words) return;

  const socket = useSocket();

  return (
    <div className={styles.wordsContainer}>
      {words.map((word, index) => {
        const data = findeds.find((d) => d.finded === word);

        const wordClass = data
          ? data.finded_by === socket.id
            ? `${styles.word} ${styles.me}`
            : `${styles.word} ${styles.opponent}`
          : styles.word;

        return (
          <p key={index} className={wordClass} translate="no">
            {word}
          </p>
        );
      })}
    </div>
  );
}
