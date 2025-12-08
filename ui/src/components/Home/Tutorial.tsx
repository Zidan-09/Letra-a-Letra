import styles from "../../styles/Home/Tutorial.module.css";

interface TutorialProps {
  isOpen: boolean;
}

export default function Tutorial({ isOpen }: TutorialProps) {
  if (!isOpen) return;

  return (
    <div className={styles.container}>
      
    </div>
  )
}