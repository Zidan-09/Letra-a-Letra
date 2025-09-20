import React from "react";
import styles from "../styles/Controls.module.css";

interface ControlsProps {
  onLeave: () => void;
  onStart: () => void;
  canStart: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onLeave, onStart, canStart }) => (
  <div className={styles.buttons}>
    <button onClick={onLeave}>Sair</button>
    <button onClick={onStart} disabled={!canStart}>
      Jogar
    </button>
  </div>
);

export default Controls;
