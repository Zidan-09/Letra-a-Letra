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
        <h3>Tem certeza que deseja sair?</h3>
        <div className={styles.buttons}>
          <button onClick={onConfirm} className={styles.yes}>Sim</button>
          <button onClick={onCancel} className={styles.no}>Não</button>
        </div>
      </div>
    </div>
  );
}
