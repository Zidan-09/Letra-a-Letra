import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import type { Player } from "../../types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MovementData = any;

const Game: React.FC = () => {
  const navigate = useNavigate();
  const waitingStageRef = useRef<HTMLDivElement | null>(null);
  const gameStageRef = useRef<HTMLDivElement | null>(null);
  const [roomId, setRoomId] = useState<string | null>(localStorage.getItem("room_id"));
  const [nickname] = useState<string | null>(localStorage.getItem("nickname"));
  const [actionType] = useState<string | null>(localStorage.getItem("action_type"));
  const [players, setPlayers] = useState<Player[]>(nickname ? [{ nickname }] : []);
  const [logs, setLogs] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const boardRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [playDisabled, setPlayDisabled] = useState<boolean>(true);
  const firstRef = useRef<string | null>(localStorage.getItem("first"));

  useEffect(() => {
    if (!nickname) {
      alert("Nickname não encontrado.");
      navigate("/");
      return;
    }

    // conectar socket
    const socket = io("http://localhost:3333");
    socketRef.current = socket;

    socket.on("connect", async () => {
      addLog(`Conectado ao servidor, socket id: ${socket.id}`);

      try {
        if (actionType === "create") {
          const body = {
            socket_id: socket.id,
            nickname,
            privateRoom: localStorage.getItem("privateRoom") === "true",
          };

          const res = await fetch("http://localhost:3333/room/createRoom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          const data = await res.json();
          const newRoomId = data.data.room_id;
          setRoomId(newRoomId);
          localStorage.setItem("room_id", newRoomId);
          addLog("Sala criada com sucesso!");
        } else if (actionType === "join") {
          const body = {
            socket_id: socket.id,
            nickname,
            room_id: roomId,
          };

          await fetch("http://localhost:3333/room/joinRoom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });

          addLog("Entrou na sala com sucesso!");
        }
      } catch (err) {
        console.error(err);
        addLog("Erro ao processar a sala.");
      }
    });

    // eventos
    socket.on("player_joinned", (roomData) => {
      setPlayers(roomData.players || []);
      addLog(`${roomData.players?.slice(-1)[0]?.nickname || "Um jogador"} entrou na sala`);
      setPlayDisabled((roomData.players || []).length < 2);
    });

    socket.on("player_left", (roomData) => {
      setPlayers(roomData.players || []);
      addLog("Um jogador saiu da sala");
      setPlayDisabled((roomData.players || []).length < 2);
    });

    socket.on("game_started", (gameData) => {
      if (waitingStageRef.current) waitingStageRef.current.style.display = "none";
      if (gameStageRef.current) gameStageRef.current.style.display = "flex";

      createBoard(10, 10);
      localStorage.setItem("first", gameData.first.player_id);
      firstRef.current = gameData.first.player_id;
      setWords(gameData.words || []);
      addLog(`Partida iniciada! Primeiro jogador: ${gameData.first.nickname}`);
      addLog(`Palavras a serem encontradas: ${(gameData.words || []).join(", ")}`);
    });

    socket.on("movement", (res) => {
      handleMovement(res);
    });

    socket.on("game_over", (data) => {
      addLog(`Vencedor: ${data.winner.nickname}`);
      setTimeout(() => {
        if (waitingStageRef.current) waitingStageRef.current.style.display = "flex";
        if (gameStageRef.current) gameStageRef.current.style.display = "none";
        setPlayDisabled(false);
      }, 2000);
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addLog(msg: string) {
    setLogs((l) => [...l, msg]);
    // optionally scroll panel if you implement ref to ul
  }

  function createBoard(rows = 10, cols = 10) {
    if (!boardRef.current) return;
    boardRef.current.innerHTML = "";
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.x = String(x);
        cell.dataset.y = String(y);
        cell.textContent = "";
        cell.addEventListener("click", async () => {
          try {
            await fetch("http://localhost:3333/game/moveGame", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                room_id: roomId,
                player_id: socketRef.current?.id,
                movement: "REVEAL",
                x,
                y,
              }),
            });
          } catch (err) {
            console.error(err);
          }
        });
        boardRef.current!.appendChild(cell);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (boardRef.current.style as any).gridTemplateColumns = `repeat(${cols}, 30px)`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (boardRef.current.style as any).gridGap = "5px";
  }

  function handleMovement(res: { movement: string; player_id: string; data: MovementData }) {
    const { movement, player_id, data } = res;
    const x = data.cell?.x;
    const y = data.cell?.y;
    if (!boardRef.current) return;
    const cell = boardRef.current.querySelector(`.cell[data-x='${x}'][data-y='${y}']`) as HTMLDivElement | null;

    if (movement === "REVEAL" && data.status === "revealed") {
      const first = firstRef.current;
      if (cell) {
        cell.textContent = data.letter;
        if (first === player_id) {
          cell.style.border = "2px solid blue";
        } else {
          cell.style.border = "2px solid orange";
        }
      }

      addLog(`Letra revelada em (${x},${y}): ${data.letter}`);

      if (data.power?.hasPowerup) {
        addLog(`Poder: ${data.power.powerup}`);
      }

      if (data.completedWord) {
        addLog(`Palavra completada: ${data.completedWord.word}`);
        for (const [i, o] of data.completedWord.positions) {
          const cell2 = boardRef.current!.querySelector(`.cell[data-x='${i}'][data-y='${o}']`) as HTMLDivElement | null;
          if (!cell2) continue;
          if (first === player_id) cell2.style.backgroundColor = "blue";
          else cell2.style.backgroundColor = "orange";
          cell2.style.color = "white";
        }
      }
    }

    if (movement === "REVEAL" && data.status === "blocked") {
      if (cell) {
        cell.textContent = data.remaining;
        if (socketRef.current?.id === player_id) {
          cell.style.backgroundColor = data.remaining === 2 ? "#3579ffff" : "#65a1fcff";
        } else {
          cell.style.backgroundColor = data.remaining === 2 ? "#ff9c3aff" : "#ffb871ff";
        }
      }
    }

    if (movement === "REVEAL" && data.status === "unblocked") {
      if (cell) cell.style.backgroundColor = "#e0e0e0";
    }

    if (movement === "BLOCK") {
      if (cell) {
        cell.style.color = "white";
        cell.textContent = "3";
        cell.style.backgroundColor = data.blocked_by === player_id ? "blue" : "orange";
      }
    }
  }

  return (
    <div className="container">
      <h1 className="title">Letra a Letra</h1>

      <div id="waiting-stage" ref={waitingStageRef} style={{ display: "flex", flexDirection: "column" }}>
        <p>
          Painel da sala: <strong id="room-id-waiting">{roomId}</strong>
        </p>
        <div id="players-panel-waiting">
          <h3>Jogadores na sala:</h3>
          <ul id="players-list-waiting">
            {players.map((p, idx) => (
              <li key={idx}>
                {p.nickname} - Pontos: {p.score || 0}
              </li>
            ))}
          </ul>
        </div>
        <div className="buttons">
          <button id="back-btn-waiting" onClick={async () => {
            try {
              await fetch(`http://localhost:333/room/leaveRoom`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  room_id: roomId,
                  player_id: socketRef.current?.id
                })
              });
            } catch (err) {
              console.error(err);
            } finally {
              navigate("/");
            }
          }}>Voltar</button>
          <button id="start-btn" disabled={playDisabled} onClick={async () => {
            addLog("Solicitado início da partida...");
            try {
              await fetch(`http://localhost:3333/game/startGame`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  room_id: roomId,
                  theme: localStorage.getItem("theme")
                })
              });
              setPlayDisabled(true);
            } catch (err) {
              console.error(err);
              addLog("Erro ao iniciar a partida.");
            }
          }}>Play</button>
        </div>
      </div>

      <div id="game-stage" ref={gameStageRef} style={{ display: "none", flexDirection: "column" }}>
        <div className="room-info">
          <p><strong>Nickname:</strong> <span id="nickname-display">{nickname}</span></p>
          <p><strong>Room ID:</strong> <span id="room-display">{roomId}</span></p>
          <p><strong>Turno:</strong> <span id="turn-display">0</span></p>
        </div>
        <div className="board" id="board" ref={boardRef} style={{ display: "grid" }} />
        <div className="players-panel" id="players-panel">
          {/* Aqui você pode renderizar painel de jogadores */}
        </div>
        <ul id="words-panel">
          {words.map((w, idx) => <li key={idx}>{w}</li>)}
        </ul>
        <div className="logs-panel" id="logs-panel">
          <h4>Logs</h4>
          <ul>
            {logs.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Game;
