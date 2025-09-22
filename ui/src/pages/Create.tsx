import styles from "../styles/Create.module.css";

export default function Create() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.titlecontainer}>
                    <h2 className={styles.title}>CRIAR SALA</h2>
                </div>
                
            </div>
        </div>
    )
}

/*
1 - Nome da Sala 
2 - Tema da partida 
3 - Configuração de Poderes (Ótima personalização) 
4 - Modo de jogo (Tem apenas 1 modo hoje, o normal, mas penso em adicionar outros modos) 
5 - Tempo por turno 
6 - Permitir espectadores 
7 - Sala privada ou não
*/