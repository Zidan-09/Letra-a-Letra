import styles from '../../styles/Lobby/ClosedPopup.module.css';

interface ClosedPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function ClosedPopup({ 
  isOpen, 
  onClose, 
  title = "AVISO",
  children 
}: ClosedPopupProps) {
  
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        
        <div className={styles.message}>
          {children}
        </div>

        <button
          className={styles.okButton}
          onClick={onClose}
          type="button"
        >
          OK
        </button>
      </div>
    </div>
  );
}