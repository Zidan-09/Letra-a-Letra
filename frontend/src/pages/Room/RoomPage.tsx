// src/pages/RoomPage.tsx
import { useState, useEffect } from 'react';
import { socket } from '../../services/socket';
import type { Page } from '../../App';

type Player = {
  id: string;
  nickname: string;
};

type RoomPageProps = {
  nickname: string;
  roomId: string;
  navigate: (page: Page) => void;
};

// Vamos definir o tipo para a célula do grid
type GridCell = {
  letter: string;
  revealed: boolean;
  owner: string | null; // ID do jogador que revelou
};

function RoomPage({ roomId, nickname, navigate }: RoomPageProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [words, setWords] = useState<string[]>([]);
  const [grid, setGrid] = useState<GridCell[][]>([]); // Estado para o grid
  const [firstPlayer, setFirstPlayer] = useState<string | null>(null);

  // useEffect para configurar os listeners do socket
  useEffect(() => {
    // Se não tivermos um ID de sala, não faz sentido estar aqui
    // Isso pode acontecer se o usuário atualizar a página
    // Uma lógica de reconexão seria necessária aqui, usando localStorage
    if (!roomId) {
        // Tenta reconectar (lógica simplificada)
        const savedRoomId = localStorage.getItem("room_id");
        if(savedRoomId) {
            socket.connect();
            socket.emit("reconnect_player", { room_id: savedRoomId, nickname: localStorage.getItem("nickname") });
        } else {
             navigate('home');
             return;
        }
    }

    // --- LISTENERS DO SOCKET ---
    const onPlayerJoined = (room: { players: Player[] }) => {
      setPlayers(room.players);
    };
    const onPlayerLeft = (room: { players: Player[] }) => {
      setPlayers(room.players);
    };
    const onGameStarted = ({ first, words: wordList }: { first: string, words: string[] }) => {
        setFirstPlayer(first);
        setWords(wordList);
        setGameStarted(true);
        // Inicializa o grid vazio aqui
        const newGrid = Array(10).fill(null).map(() => Array(10).fill({
            letter: '',
            revealed: false,
            owner: null
        }));
        setGrid(newGrid);
    };
    const onLetterRevealed = ({ x, y, data, player_id }: { x: number, y: number, data: string | { letter: string }, player_id: string }) => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]); // Cópia profunda
            const letter = typeof data === 'string' ? data : data.letter;
            newGrid[x][y] = { letter, revealed: true, owner: player_id };
            return newGrid;
        });
    };

    socket.on("player_joinned", onPlayerJoined);
    socket.on("player_left", onPlayerLeft);
    socket.on("game_started", onGameStarted);
    socket.on("letter_revealed", onLetterRevealed);
    
    // Função de limpeza: Roda quando o componente é "desmontado"
    return () => {
      socket.off("player_joinned", onPlayerJoined);
      socket.off("player_left", onPlayerLeft);
      socket.off("game_started", onGameStarted);
      socket.off("letter_revealed", onLetterRevealed);
    };
  }, [roomId, nickname, navigate]); // Dependências do useEffect

  const handleStartGame = () => {
    fetch(`http://localhost:3333/game/startGame/${roomId}`);
  };

  const handleLeaveRoom = () => {
    fetch(`http://localhost:3333/room/leaveRoom`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room_id: roomId, player_id: socket.id }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        socket.disconnect();
        navigate('home');
      } else {
        alert(data.message);
      }
    });
  };

  const handleCellClick = (x: number, y: number) => {
    fetch(`http://localhost:3333/game/revealLetter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: roomId, player_id: socket.id, x, y })
    });
  };


  if (!gameStarted) {
    return (
      <div className="panel">
        <h2 id="room_id">{roomId}</h2>
        <h2>Players in Room:</h2>
        <div id="players">
          {players.map(p => <p key={p.id}>{p.nickname}</p>)}
        </div>
        <input
          type="button"
          value="Start Game"
          id="startGame"
          disabled={players.length < 2}
          onClick={handleStartGame}
        />
        <input type="button" value="Leave Room" id="leaveRoom" onClick={handleLeaveRoom} />
      </div>
    );
  }

  // Renderiza o jogo
  return (
    <div className="all" style={{ display: 'flex' }}>
        <div className="words">
            {words.map((word, index) => <p key={index}>{word}</p>)}
        </div>
        <div id="game">
            <div className="grid">
                {grid.map((row, x) => 
                    row.map((cell, y) => {
                        let className = '';
                        if(cell.revealed) {
                            className = cell.owner === firstPlayer ? 'blue' : 'orange';
                        }
                        return (
                            <button
                                key={`${x}-${y}`}
                                disabled={cell.revealed}
                                className={className}
                                onClick={() => handleCellClick(x, y)}
                            >
                                {cell.letter}
                            </button>
                        );
                    })
                )}
            </div>
        </div>
        <div className="chat" id="chat">
            {/* O chat pode ser um componente futuro! */}
        </div>
    </div>
  );
}

export default RoomPage;