import { useState } from "react";
import styles from "../styles/Home.module.css";
import logo from "../assets/logo.png";
import iconCreate from "../assets/icon-create.png";
import iconEnter from "../assets/icon-enter.png";
import iconHelp from "../assets/icon-help.png";

export default function Home() {
  const [nome, setNome] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src={logo} alt="Logo Letra a Letra" className={styles.logo} />

        <p className={styles.label}>Nickname</p>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Digite seu Nickname..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.buttons}>
          <button className={`${styles.button} ${styles.create}`}>
            <img src={iconCreate} alt="Create" className={styles.icon} />
            Criar Sala
          </button>
          <button className={`${styles.button} ${styles.enter}`}>
            <img src={iconEnter} alt="Enter" className={styles.icon} />
            Entrar na Sala
          </button>
        </div>

        <button className={`${styles.button} ${styles.help}`}>
          <img src={iconHelp} alt="Help" className={styles.icon} />
          Como Jogar
        </button>
      </div>
    </div>
  );
}