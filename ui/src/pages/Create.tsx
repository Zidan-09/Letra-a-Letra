import { useState } from "react";
import { useNavigate } from "react-router-dom";
import back from "../assets/buttons/icon-back.svg";
import create from "../assets/buttons/icon-create.svg";
import styles from "../styles/Create.module.css";
import PowerPopup from "../components/Create/PowerPopup";
// import { type } from '../utils/room_utils';

export default function Create() {
    const [RoomName, setRoomName] = useState("");
    const [Theme, setTheme] = useState("");
    const [gameMode, setGameMode] = useState('NORMAL');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    // const [AllowSpectators, setAllowSpectators] = useState(false);
    // const [PrivateRoom, setPrivateRoom] = useState(false);
    
    const navigate = useNavigate();

    const handleBack = () => {
        return navigate("/");
    }

    const handleNext = () => {
        return navigate("/lobby")
    }

    // const handleSubimit = () => {
    //     const data = {
    //         AllowSpectators,
    //         PrivateRoom
    //     }
    // }

    const handleModeToggle = () => {
        setGameMode(prevMode => (prevMode === 'NORMAL' ? 'CRAZY' : 'NORMAL'))
    };

    return(
         <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.titlecontainer}>
                <h2 className={styles.title}>Criar Sala</h2>
                </div>

                <div className={styles.form}>
                    <p className={styles.labelname}>Nome da Sala</p>
                    <input type="text"
                    placeholder="Digite o nome da sala..."
                    value={RoomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className={styles.input}/>
                    <div className={styles.selectcontainer}>
                        <div className={styles.themecontainer}>
                    <label htmlFor="theme" className={styles.label}>Tema:</label>
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
                    </div>
                
                    <div className={styles.powers}>
                        <p className={styles.label}>Power:</p>
                        <button
                            className={styles.selectButton}
                            onClick={() => setIsPopupOpen(true)}>
                                Selecionar
                            </button>
                    </div>
                    <PowerPopup
                        isOpen={isPopupOpen}
                        onClose={() => setIsPopupOpen(false)}/>

                <div className={styles.modeSelector}>
                    <label className={styles.label}>Modo:</label>
                    <button 
                    type="button"
                    onClick={handleModeToggle}
                    className={`${styles.button1} ${gameMode === 'NORMAL' ? styles.modeNormal : styles.modeCrazy}`}
                    > {gameMode === 'NORMAL' ? 'NORMAL' : 'MALUCO'}
                    </button> 
                    </div>
                    </div>

                    <div className={styles.checkbox}>
                        <div className={styles.spectators}>
                            <p className={styles.label}>Espectadores</p>
                             <label className={styles.switch}>
                            <input 
                            type="checkbox"
                            className={styles.allowSpectators} id="checkbox"/>
                            {/* checked={AllowSpectators}
                             onChange={(e) => setAllowSpectators (e.target.checked)}/>*/}
                             <span className={styles.slider}></span>
                             </label> 
                        </div>

                    <div className={styles.private}>
                        <p className={styles.label}>Privada</p>
                        <label className={styles.switch}>
                            <input
                            type="checkbox" className={styles.privateRoom} id="checkbox"/>
                             { /* checked={PrivateRoom}
                             onChange={(e) => setPrivateRoom(e.target.checked)}/> */}
                             <span className={styles.slider}></span>
                             </label> 
                    </div>
                    </div>
                </div>

                <div className={styles.buttons}>
                    <button className={`${styles.button} ${styles.back}`} onClick={handleBack}>
                        <img src={back} alt="Back" className={styles.icon}/>
                        Voltar
                    </button>
                    <button className={`${styles.button} ${styles.create}`} onClick={handleNext}>
                        <img src={create} alt="Create" className={styles.icon}/>
                        Criar
                    </button>
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