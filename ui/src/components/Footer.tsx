import logo from "../assets/logo.svg";
import github from "../assets/social/icon-github.svg";
import linkedin from "../assets/social/icon-linkedin.svg";
import styles from "../styles/Footer.module.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.devs}>
        <div className={styles.dev}>
          <p>Zidan</p>
          <a href="https://github.com/Zidan-09">
            {" "}
            <img src={github} alt="github" />
          </a>
          <a href="https://www.linkedin.com/in/samuel-nascimento-fullstack/">
            {" "}
            <img src={linkedin} alt="linkedin" />
          </a>
        </div>

        <div className={styles.dev}>
          <p>Biel</p>
          <a href="https://github.com/Gabriel-afk-9">
            {" "}
            <img src={github} alt="github" />
          </a>
          <a href="https://www.linkedin.com/in/gabriel-lima-62a376326">
            {" "}
            <img src={linkedin} alt="linkedin" />
          </a>
        </div>
      </div>

      <img src={logo} alt="Logo" className={styles.logo} />

      <p className={styles.version}>v1.0.0-alpha</p>
    </div>
  );
}
