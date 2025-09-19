import { useEffect, useState } from "react";
import type { Game } from "../utils/room_utils";
import "../styles/JoinRoom.css";

function JoinRoomPage() {
  // Estado para armazenar as salas
  const [rooms, setRooms] = useState<Game[]>([]);
  // Estado para controlar o feedback de carregamento
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Estado para armazenar e exibir mensagens de erro
  const [error, setError] = useState<string | null>(null);

  // Função para buscar as salas, agora com tratamento de erro e loading
  async function reloadRooms() {
    setIsLoading(true); // Ativa o estado de carregamento
    setError(null); // Limpa erros anteriores

    try {
      const response = await fetch("http://localhost:3333/rooms/getRooms");
      
      // Verifica se a requisição foi bem-sucedida
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.statusText}`);
      }

      // Supondo que a API retorna um objeto { data: Game[] }
      const result = await response.json();
      
      // Define as salas usando a propriedade 'data' da resposta
      // O '|| []' garante que, se 'data' for nulo, 'rooms' se torne um array vazio
      setRooms(result.data || []); 

    } catch (err) {
      // Captura qualquer erro de rede ou da lógica acima
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido";
      setError(errorMessage);
      console.error("Falha ao buscar as salas:", err);
      setRooms([]); // Limpa as salas em caso de erro
    } finally {
      setIsLoading(false); // Desativa o estado de carregamento, ocorrendo erro ou não
    }
  }

  // O useEffect continua o mesmo, chamando a função ao montar o componente
  useEffect(() => {
    reloadRooms();
  }, []);

  // Função para renderizar o conteúdo principal da lista de salas
  const renderContent = () => {
    if (isLoading) {
      return <p>Carregando salas...</p>;
    }
    if (error) {
      return <p style={{ color: "red" }}>Erro ao carregar salas: {error}</p>;
    }
    if (rooms.length === 0) {
      return <p>Nenhuma sala encontrada.</p>;
    }
    return rooms.map((room) => (
      <div className="room-item" key={room.room_id}>
        {/* Renderiza as informações da sala de forma mais estruturada */}
        <span className="room-id">ID: {room.room_id}</span>
        <span className="room-players">
          Jogadores: {room.players.map((p) => p.nickname).join(", ")}
        </span>
        {/* Adicione um botão para entrar na sala específica */}
        <button className="join-button">Entrar</button>
      </div>
    ));
  };

  return (
    <div className="join-room-container">
      <h1>Entrar na Sala</h1>

      <div className="button-group">
        <button>Inserir código da sala</button>
        {/* Desabilita o botão enquanto estiver carregando para evitar múltiplas chamadas */}
        <button onClick={reloadRooms} disabled={isLoading}>
          {isLoading ? "Recarregando..." : "Recarregar Salas"}
        </button>
      </div>

      <div id="Rooms">
        {renderContent()}
      </div>
    </div>
  );
}

export default JoinRoomPage;