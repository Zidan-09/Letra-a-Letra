import React, { useState } from "react";
import styles from "../styles/Room/PopupInsertCode.module.css";

interface Props {
  close: () => void;
}

const PopupInsertCode: React.FC<Props> = ({ close }) => {
  const [code, setCode] = useState("");

  const handleEnter = () => {
    if (!code) return;
    // Aqui você pode validar e entrar na sala pelo código
    alert(`Entrando na sala ${code}`);
    close();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h3>Inserir Código</h3>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Digite o código da sala"
        />
        <button onClick={handleEnter}>Entrar Sala</button>
        <button onClick={close}>Cancelar</button>
      </div>
    </div>
  );
};

export default PopupInsertCode;