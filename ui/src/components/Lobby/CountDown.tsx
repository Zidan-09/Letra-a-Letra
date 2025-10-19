import { useEffect, useState } from "react";
import styles from "../../styles/Lobby/CountDown.module.css";

interface CountdownProps {
  start?: number;
  onFinish: () => void;
}

export default function Countdown({ start = 3, onFinish }: CountdownProps) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (count <= 0) {
      onFinish();
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onFinish]);

  return (
    <div className={styles.overlay}>
      <div className={styles.number}>{count}</div>
      <p className={styles.label}>Partida começando...</p>
    </div>
  );
}
