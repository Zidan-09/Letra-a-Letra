import { useState, useEffect } from "react";
import styles from "../styles/Loading.module.css";

export default function Loading() {
    const [dots, setDots] = useState(".");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? "." : prev + "."));
        }, 500);
        return () => clearInterval(interval);
    }, [])

    return (
        <div className={styles.overlay}>
            <h2 className={styles.loading}>Carregando{dots}</h2>
        </div>
    )
}