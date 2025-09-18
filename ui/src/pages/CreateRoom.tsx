import "../styles/CreateRoom.css";

function CreateRoom() {
    return (
        <>
            <div>
                <h1>Criar Sala</h1>
                <form>
                    <label htmlFor="theme">Tema:</label>
                    <select name="theme" id="theme">
                        <option value="random">Aleatório</option>
                        <option value="tech">Tech</option>
                        <option value="fruits">Frutas</option>
                        <option value="cities">Cidades</option>
                        <option value="animals">Animais</option>
                        <option value="colors">Cores</option>
                        <option value="sports">Esportes</option>
                        <option value="foods">Comidas</option>
                        <option value="jobs">Trabalhos</option>
                        <option value="nature">Natureza</option>
                        <option value="space">Espaço</option>
                    </select>
                    <label htmlFor="turnTime">Tempo de Turno:</label>
                    <input type="number" name="turnTime" id="turnTime" min="15" max="40"/>
                    <label htmlFor="privateRoom">Sala Privada</label>
                    <input type="checkbox" name="privateRoom" id="privateRoom"/>
                    <div>
                        <button type="submit">Criar Sala</button>
                        <button type="button">Voltar</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CreateRoom;