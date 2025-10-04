import { useEffect, useState } from "react";
import { useSocket } from "../services/socketProvider";
import type { Game, MovementsEnum, MoveEmit, Player } from "../utils/room_utils";
import { Server } from "../utils/server_utils";
import PlayerCard from "../components/Game/PlayerCard";
import Slots from "../components/Game/Slots";
import Board from "../components/Game/Board";
import Words from "../components/Game/Words";
import logo from "../assets/logo.svg";
import styles from "../styles/Game.module.css";
import { useNavigate } from "react-router-dom";

export default function Game() {
    const [actualState, setActualState] = useState<Game>();
    const [words, setWords] = useState<string[]>([]);
    const [first, setFirst] = useState();
    const [movement, setMovement] = useState<MovementsEnum>("REVEAL");
    const socket = useSocket();
    const navigate = useNavigate();
    const [me, setMe] = useState<Player | undefined>(undefined);
    const [opponent, setOpponent] = useState<Player | undefined>(undefined);

    useEffect(() => {
        const gameData = localStorage.getItem("game");
        const wordsData = localStorage.getItem("words");
        const firstData = localStorage.getItem("first");

        if (!gameData || !wordsData || !firstData) {
            navigate("/");
            return;
        };

        const game: Game = JSON.parse(gameData);
        const words = JSON.parse(wordsData);
        const first = JSON.parse(firstData);
        
        setWords(words);
        setFirst(first);
        setActualState(game);

        const searchMe = game.players.find(p => p.player_id === socket.id);
        const searchOpponent = game.players.find(o => o.player_id !== socket.id);

        setMe(searchMe);
        setOpponent(searchOpponent);

    }, [navigate, socket?.id]);

    useEffect(() => {
        if (!socket) return;

        const handleMovement = (payload: { movement: MovementsEnum; player_id: string; data: MoveEmit }) => {
            setActualState(prev => {
                if (!prev) return prev;

                const newState: Game = { ...prev };

                const { cell, letter, completedWord, traps, power } = payload.data;

                if (newState.board) {
                    newState.board = { ...newState.board };
                    newState.board.grid = newState.board.grid.map(row => [...row]);
                }

                switch (payload.movement) {
                    case "REVEAL":
                        if (cell && letter && newState.board) {
                            const c = newState.board.grid[cell.x][cell.y];
                            newState.board.grid[cell.x][cell.y] = { 
                                ...c, 
                                letter, 
                                revealed: true 
                            };
                        }
                        if (completedWord && newState.board) {
                            completedWord.positions.forEach(([x, y]) => {
                                const c = newState.board!.grid[x][y];
                                newState.board!.grid[x][y] = { ...c, revealed: true };
                            });
                            if (!newState.board.findedWords.includes(completedWord.word)) {
                                newState.board.findedWords.push(completedWord.word);
                            }
                        }
                        break;

                    case "BLOCK":
                        if (cell && newState.board) {
                            const c = newState.board.grid[cell.x][cell.y];
                            newState.board.grid[cell.x][cell.y] = {
                                ...c,
                                blocked: { status: true, blocked_by: payload.player_id }
                            };
                        }
                        break;

                    case "UNBLOCK":
                        if (cell && newState.board) {
                            const c = newState.board.grid[cell.x][cell.y];
                            newState.board.grid[cell.x][cell.y] = {
                                ...c,
                                blocked: { status: false, blocked_by: null }
                            };
                        }
                        break;

                    case "TRAP":
                        
                        break;

                    case "FREEZE":
                    case "UNFREEZE":
                        if (payload.player_id) {
                            const idx = newState.players.findIndex(p => p.player_id === payload.player_id);
                            if (idx !== -1) {
                                newState.players[idx] = {
                                    ...newState.players[idx],
                                    freeze: {
                                        active: payload.movement === "FREEZE",
                                        remaining: payload.data.remaining ?? newState.players[idx].freeze.remaining
                                    }
                                };
                            }
                        }
                        break;

                    case "BLIND":
                        if (payload.player_id) {
                            const idx = newState.players.findIndex(p => p.player_id === payload.player_id);
                            if (idx !== -1) {
                                newState.players[idx] = {
                                    ...newState.players[idx],
                                    blind: { active: true, remaining: payload.data.remaining ?? null }
                                };
                            }
                        }
                        break;

                    case "LANTERN":
                    case "IMMUNITY":
                        if (power && payload.player_id) {
                            const idx = newState.players.findIndex(p => p.player_id === payload.player_id);
                            if (idx !== -1) {
                                newState.players[idx] = {
                                    ...newState.players[idx],
                                    immunity: {
                                        active: power.hasPowerup,
                                        remaining: payload.data.remaining ?? null
                                    }
                                };
                            }
                        }
                        break;

                    case "SPY":
                    case "DETECTTRAPS":
                        if (traps && newState.board) {
                            for (let i of traps) {
                                const c = newState.board.grid[i.x][i.y];
                                newState.board.grid[i.x][i.y] = { 
                                    ...c
                                };
                            }
                        }
                        break;
                }

                return newState;
            });
        };

        socket.on("movement", handleMovement);

        return () => { socket.off("movement", handleMovement); };
    }, [socket]);

    const handleSelectPower = (power: MovementsEnum) => {
        setMovement(power);
    }

    const handleClickCell = async (x: number, y: number) => {
        if (!actualState || !me) return null;

        try {
            await fetch(`${Server}/game/${actualState.room_id}/move`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    player_id: me.player_id,
                    movement: movement,
                    x: x,
                    y: y
                })
            }).then(res => res.json()).then(data => data);

        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className={styles.container}>
            <header>
                {actualState && me && opponent ? (
                    <div className={styles.cardContainer}>
                        <PlayerCard player={me} />
    
                        <img src={logo} alt="Logo" />
    
                        <PlayerCard player={opponent} />
                    </div>
                ) : (
                    <div>NAM</div>
                )}
            </header>

            <main>
                {actualState && actualState.board && words && me ? (
                    <div className={styles.gameContainer}>
                        <Slots player={me} selectPower={handleSelectPower}/>
    
                        <Board board={actualState.board} onClickCell={handleClickCell}/>

                        <Words words={words} findeds={actualState.board.findedWords}/>
                    </div>
                ) : (
                    <div>LOADING...</div>
                )}
            </main>
        </div>
    )
}