import { useState } from "react";
import { useNavigate } from "react-router-dom";
import back from "../assets/buttons/icon-back.png";
import create from "../assets/buttons/icon-create.png";
import styles from "../styles/Create.module.css";

export default function Create() {
    const [RoomName, setRoomName] = useState("");
    const [Theme, setTheme] = useState("");
    const navigate = useNavigate();

    const handleBack = () => {
        return navigate("/");
    }

    return(
         <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.titlecontainer}></div>
                <h2 className={styles.title}>Criar Sala</h2>
                </div>

                <div className={styles.form}>
                    <p className={styles.label}>Nome da Sala</p>
                    <input type="text"
                    placeholder="Digite o nome da sala..."
                    value={RoomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className={styles.input}/>
                    <select name="theme" 
                    id="theme"
                    value={Theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className={styles.themes}>
                        <option value="random">Aleatório</option>
                        <option value="tech">Tecnologia</option>
                        <option value="fruits">Frutas</option>
                        <option value="cities">Cidades</option>
                        <option value="animals">Animais</option>
                        <option value="colors">Cores</option>
                        <option value="sports">Esportes</option>
                        <option value="foods">Comidas</option>
                        <option value="jobs">Profissões</option>
                        <option value="nature">Natureza</option>
                        <option value="space">Espaço</option>
                    </select>

                    <div className={styles.powers}>

                    </div>

                    <select name="gamemode" id="gamemode" className={styles.gamemode}>
                        <option value="NORMAL">NORMAL</option>
                        <option value="CRAZY">MALUCO</option>
                    </select>   

                    <div className={styles.spectators}>
                        <p className={styles.label}>Espectadores</p>
                        <input type="checkbox" className={styles.allowSpectators} id="checkbox"/>
                    </div>

                    <div className={styles.private}>
                        <p className={styles.label}>Privada</p>
                        <input type="checkbox" className={styles.privateRoom} id="checkbox"/>
                    </div>

                </div>

                <div className={styles.buttons}>
                    <button className={`${styles.button} ${styles.back}`} onClick={handleBack}>
                        <img src={back} alt="Back" className={styles.icon}/>
                        Voltar
                    </button>
                    <button className={`${styles.button} ${styles.create}`}>
                        <img src={create} alt="Create" className={styles.icon}/>
                        Criar
                    </button>
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