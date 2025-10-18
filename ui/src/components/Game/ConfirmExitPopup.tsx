import styles from "../../styles/Game/ConfirmExitPopup.module.css";

interface ConfirmExitPopupProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmExitPopup({ isOpen, onConfirm, onCancel }: ConfirmExitPopupProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Tem certeza que deseja sair?</h2>
        <div className={styles.buttons}>
          <button onClick={onConfirm} className={`${styles.button} ${styles.back}`}>Sair</button>
          <button onClick={onCancel} className={`${styles.button} ${styles.continue}`}>Continuar</button>
        </div>
      </div>
    </div>
  );
}
