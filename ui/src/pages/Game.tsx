import { useEffect, useState, useRef } from "react";
import { useSocket } from "../services/socketProvider";
import { useNavigate } from "react-router-dom";
import settings from "../settings.json";
import type { Game, Player, MovementsEnum, GameData, CompletedWord, CellKeys, CellUpdate, NullPlayer } from "../utils/room_utils";
import { PassTurn } from "../utils/passTurn";
import PlayerCard from "../components/Game/PlayerCard";
import Slots from "../components/Game/Slots";
import Board from "../components/Game/Board";
import ExtraButtons from "../components/Game/ExtraButtons";
import Words from "../components/Game/Words";
import TurnOverlay from "../components/Game/TurnOverlay";
import EffectOverlay from "../components/Game/EffectOverlay";
import WinnerOverlay from "../components/Game/WinnerOverlay";
import Loading from "../components/Loading";
import logo from "../assets/logo.svg";
import styles from "../styles/Game.module.css";

export default function Game() {
    const [room, setRoom] = useState<Game>();
    const [p1, setP1] = useState<Player>();
    const [p2, setP2] = useState<Player>();
    const [cells, setCells] = useState<Record<CellKeys, CellUpdate>>({});
    const [turn, setTurn] = useState<number>(0);

    const [hidedLetters, setHidedLetters] = useState<CellUpdate[]>([]);
    const [hidedWords, setHidedWords] = useState<{ finded_by: string, finded: string, positions: [number, number][] }[]>([]);

    const [words, setWords] = useState<string[]>();
    const [findeds, setFindeds] = useState<CompletedWord[]>([]);

    const [move, setMove] = useState<MovementsEnum>("REVEAL");
    const [moveIdx, setMoveIdx] = useState<number | undefined>(undefined);

    const [winner, setWinner] = useState<Player | NullPlayer | undefined>(undefined);

    const [isChatOpen, setChatOpen] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(true);

    const spyTimers = useRef<Map<string, number>>(new Map());

    const socket = useSocket();

    const navigate = useNavigate();

    useEffect(() => {
        let game = localStorage.getItem("game");
        let wordsData = localStorage.getItem("words");

        if (!socket || !socket.id) return;

        if (!game || !wordsData) {
            navigate("/");
            return;
        }

        const data: Game = JSON.parse(game);
        const wordsParsed: string[] = JSON.parse(wordsData);

        const me = [...data.players, ...data.spectators].filter(Boolean).find(p => p.player_id === socket.id);
        const p1Data = data.players[0];
        const p2Data = data.players[1];

        if (!me || !p1Data || !p2Data || !wordsParsed) {
            navigate("/");
            return;
        }

        setRoom(data);
        setWords(wordsParsed);

        if (me.spectator) {
            setP1(p1Data);
            setP2(p2Data);
            return;
        }

        setP1(me);
        const opponent = data.players.find(p => p.player_id !== me.player_id);
        setP2(opponent); 
        
        setLoading(false);

    }, [navigate, socket]);

    useEffect(() => {
        if (!room || !p1) return;

        if (turn % 2 !== p1.turn) return;

        PassTurn.passTurnEffect(p1, room.room_id);

    }, [turn]);

    useEffect(() => {
        if (!room || !p1) return;
        if (p1.blind.active) return;
        if (hidedLetters.length === 0 && hidedWords.length === 0) return;

        setCells(prev => {
            const copy = { ...prev };

            hidedLetters.forEach(data => {
                const key = `${data.x}-${data.y}` as CellKeys;
                copy[key] = {
                    ...copy[key],
                    letter: data.letter,
                    actor: data.actor
                };
            });

            hidedWords.forEach(p => {
                p.positions.forEach(pos => {
                    const key = `${pos[0]}-${pos[1]}` as CellKeys;
                    copy[key] = {
                        ...copy[key],
                        finded_by: p.finded_by
                    };
                });
            });

            return copy;
        });

        setHidedLetters([]);
        setHidedWords([]);
    }, [p1?.blind.active]);


    useEffect(() => {
        if (!socket) return;

        socket.on("movement", ({player_id, movement, data, players, turn}: GameData) => {
            setTurn(turn);
            let p1Data: Player;

            setP1(prev => {
                if (!prev) return prev;

                const copy = { ...prev };
                const player = players.find(p => p.player_id === copy.player_id);
                
                if (!player) return prev;
                p1Data = player;

                return player;
            });

            setP2(prev => {
                if (!prev) return prev;

                const copy = { ...prev };
                const player = players.find(p => p.player_id === copy.player_id);

                if (!player) return prev;

                return player;
            });

            setCells(prev => {
                const copy = { ...prev };
                const key = data.cell ? `${data.cell.x}-${data.cell.y}` as CellKeys : null;

                if (key) {
                    const oldTimer = spyTimers.current.get(key);
                    if (oldTimer) {
                        clearTimeout(oldTimer);
                        spyTimers.current.delete(key);
                    }
                }

                switch (movement) {
                    case "BLOCK":
                        if (data.cell) {
                            const key = `${data.cell.x}-${data.cell.y}` as CellKeys;
                            copy[key] = {
                                ...copy[key],
                                blocked: { blocked_by: data.blocked_by, remaining: data.remaining }
                            }
                        }

                        break;
                    case "UNBLOCK":
                        if (data.cell) {
                            const key = `${data.cell.x}-${data.cell.y}` as CellKeys;
                            copy[key] = {
                                ...copy[key],
                                blocked: { blocked_by: undefined, remaining: undefined},
                                letter: data.letter,
                                actor: player_id
                            };
                        }

                        if (data.completedWord) {
                            const find = {
                                finded_by: player_id,
                                finded: data.completedWord.word,
                                positions: data.completedWord.positions
                            }

                            setFindeds(prev => [...prev, find]);

                            data.completedWord.positions.forEach(p => {
                                const key = `${p[0]}-${p[1]}` as CellKeys;
                                copy[key] = {
                                    ...copy[key],
                                    finded_by: player_id
                                }
                            })
                        }
                        
                        break;

                    case "TRAP":
                        if (data.cell) {
                            const key = `${data.cell.x}-${data.cell.y}` as CellKeys;

                            if (data.status === "trap_trigged") {
                                copy[key] = {
                                    ...copy[key],
                                    trapTrigged: true,
                                    trapped_by: data.trapped_by
                                }

                                setTimeout(() => {
                                    setCells(prev => {
                                        const resetCopy = { ...prev };
                                        const cellToReset = resetCopy[key];
                                        if (cellToReset) {
                                            resetCopy[key] = {
                                                ...cellToReset,
                                                trapped_by: undefined,
                                                trapTrigged: false,
                                                detected: false,
                                                actor: undefined
                                            };
                                        }
                                        return resetCopy;
                                    });
                                }, 1500);
                                break;
                            }

                            copy[key] = {
                                ...copy[key],
                                trapped_by: data.trapped_by,
                                actor: player_id
                            };
                        }
                        break;

                    case "DETECT_TRAPS":
                        if (data.traps) {
                            data.traps.forEach(trap => {
                                const key = `${trap.x}-${trap.y}` as CellKeys;
                                copy[key] = {
                                    ...copy[key],
                                    detected: true,
                                    trapped_by: data.trapped_by
                                };
                            });
                        }
                        break;

                    case "SPY":
                        if (!key) break;

                        copy[key] = {
                            ...copy[key],
                            letter: data.letter,
                            spied: true
                        };

                        const timer = window.setTimeout(() => {
                            setCells(prev => {
                                const updated = { ...prev };
                                if (updated[key]?.spied) {
                                    updated[key] = {
                                        ...updated[key],
                                        letter: undefined,
                                        spied: false
                                    };
                                }
                                return updated;
                            });
                            spyTimers.current.delete(key);
                        }, 10000);

                        spyTimers.current.set(key, timer);
                        break;

                    case "REVEAL":
                        if (data.cell) {
                            const key = `${data.cell.x}-${data.cell.y}` as CellKeys;

                            if (p1Data && p1Data.blind.active) {
                                const newHideLetter: CellUpdate = {
                                    ...copy[key],
                                    x: data.cell.x,
                                    y: data.cell.y,
                                    letter: data.letter,
                                    actor: player_id
                                };

                                const newFind: CompletedWord | undefined = data.completedWord ? {
                                    finded_by: player_id,
                                    finded: data.completedWord.word,
                                    positions: data.completedWord.positions
                                } : undefined;

                                setHidedLetters(prev => [...prev, newHideLetter]);

                                if (newFind) {
                                    setHidedWords(prev => [...prev, newFind]);
                                    setFindeds(prev => [...prev, newFind]);
                                };

                                break;
                            };
                            
                            if (data.status === "trap_trigged") {
                                copy[key] = {
                                    ...copy[key],
                                    trapTrigged: true,
                                    trapped_by: data.trapped_by
                                }

                                setTimeout(() => {
                                    setCells(prev => {
                                        const resetCopy = { ...prev };
                                        const cellToReset = resetCopy[key];
                                        if (cellToReset) {
                                            resetCopy[key] = {
                                                ...cellToReset,
                                                trapped_by: undefined,
                                                trapTrigged: false,
                                                detected: false,
                                                actor: undefined
                                            };
                                        }
                                        return resetCopy;
                                    });
                                }, 1500);
                                break;
                            }

                            if (data.status === "blocked") {
                                copy[key] = {
                                    ...copy[key],
                                    blocked: { blocked_by: copy[key].blocked?.blocked_by, remaining: data.remaining }
                                }

                                break;
                            }

                            copy[key] = {
                                ...copy[key],
                                letter: data.letter,
                                actor: player_id
                            };
                        }

                        if (data.completedWord) {
                            const find: CompletedWord | undefined = data.completedWord ? {
                                finded_by: player_id,
                                finded: data.completedWord.word,
                                positions: data.completedWord.positions
                            } : undefined;

                            if (find) setFindeds(prev => [...prev, find]);

                            data.completedWord.positions.forEach(p => {
                                const key = `${p[0]}-${p[1]}` as CellKeys;
                                copy[key] = {
                                    ...copy[key],
                                    finded_by: player_id
                                };
                            });
                        };

                        break;
                };

                return copy;
            });
        });

        socket.on("player_left", (updatedRoom: Game) => {
            setRoom({ ...updatedRoom, players: [...updatedRoom.players], spectators: [...updatedRoom.spectators] });
        })

        socket.on("game_over", ({winner, room}) => {
            if (room) localStorage.setItem("game", JSON.stringify(room));

            setWinner(winner);
        });

        return () => {
            socket.off("movement");
            socket.off("player_left");
            socket.off("game_over");
            spyTimers.current.forEach(timer => clearTimeout(timer));
            spyTimers.current.clear();
        }
    }, [socket, setP1, setP2, setCells, setFindeds]);

    const handleMovement = async (x?: number, y?: number) => {
        try {
            const res = await fetch(`${settings.server}/game/${room?.room_id}/move`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    player_id: socket.id,
                    movement: move,
                    powerIndex: moveIdx,
                    x: x,
                    y: y
                })
            }).then(res => res.json()).then(data => data);

            if (!res.success) console.warn(res);

        } catch (err) {
            console.error(err);
        }

        setMove("REVEAL");
        setMoveIdx(undefined);
    }

    const handleChat = () => {
        setChatOpen(true);
    }

    if (loading || !p1 || !p2 || !words) return <Loading />

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <PlayerCard
                id={0}
                player={p1}
                />

                <img src={logo} alt="Logo" className={styles.logo} />

                <PlayerCard
                id={1}
                player={p2}
                />
            </div>

            <div className={styles.game}>
                {p1.player_id === socket.id ? (
                    <Slots
                    playerPowers={p1.powers}
                    selected={moveIdx}
                    selectMove={setMove}
                    selectMoveIdx={setMoveIdx}
                    applyEffect={handleMovement}
                    />
                ) : (
                    <div></div>
                )}

                <Board
                p1={p1}
                cellsData={cells}
                move={move}
                moveIdx={moveIdx}
                onCellClick={p1.player_id === socket.id ? handleMovement : undefined}
                />

                <Words
                words={words}
                findeds={findeds}
                />
            </div>
            
            {room && (
                <ExtraButtons
                room_id={room.room_id}
                nickname={[...room.players, ...room.spectators].filter(Boolean).find(p => p.player_id === socket.id)?.nickname}
                setPopup={handleChat}
                isOpen={isChatOpen}
                onClose={() => {setChatOpen(false)}}
                />
            )}

            <TurnOverlay p1={p1} p2Nickname={p2.nickname} turn={turn} />
            
            <EffectOverlay freeze={p1.freeze.active} blind={p1.blind.active} immunity={p1.immunity.active} />
            <WinnerOverlay room_id={room?.room_id} winner={winner} isOpen={winner ? true : false} />
        </div>
    )
}