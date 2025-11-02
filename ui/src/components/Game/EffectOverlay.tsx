import styles from "../../styles/Game/EffectOverlay.module.css";

interface EffectOverlayProps {
  freeze?: boolean;
  blind?: boolean;
  immunity?: boolean;
}

export default function EffectOverlay({
  freeze,
  blind,
  immunity,
}: EffectOverlayProps) {
  return (
    <>
      {freeze && (
        <div className={`${styles.overlay} ${styles.freeze}`}>
          <div className={styles.freezeBorders}></div>
        </div>
      )}
      {blind && (
        <div className={`${styles.overlay} ${styles.blind}`}>
          <div className={styles.blindBorders}></div>
        </div>
      )}
      {immunity && (
        <div className={`${styles.overlay} ${styles.immunity}`}>
          <div className={styles.immunityBorders}></div>
        </div>
      )}
    </>
  );
}
