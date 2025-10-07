import { useEffect, useState } from "react";
import { useSocket } from "../services/socketProvider";
import { useNavigate } from "react-router-dom";
import settings from "../settings.json";
import type { Game, Player, MovementsEnum, GameData, CompletedWord, CellKeys, CellUpdate } from "../utils/room_utils";
import PlayerCard from "../components/Game/PlayerCard";
import Slots from "../components/Game/Slots";
import Board from "../components/Game/Board";
import logo from "../assets/logo.svg";
import styles from "../styles/Game.module.css";
import Words from "../components/Game/Words";
import WinnerOverlay from "../components/Game/WinnerOverlay";
import EffectOverlay from "../components/Game/EffectOverlay";
import { PassTurn } from "../utils/passTurn";

export default function Game() {
    const [room, setRoom] = useState<string>();
    const [p1, setP1] = useState<Player>();
    const [p2, setP2] = useState<Player>();
    const [cells, setCells] = useState<Record<CellKeys, CellUpdate>>({});

    const [words, setWords] = useState<string[]>();
    const [findeds, setFindeds] = useState<CompletedWord[]>([]);

    const [move, setMove] = useState<MovementsEnum>("REVEAL");
    const [moveIdx, setMoveIdx] = useState<number | undefined>(undefined);

    const [winner, setWinner] = useState<Player | undefined>(undefined);

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

        setRoom(data.room_id);
        setWords(wordsParsed);

        if (me.spectator) {
            setP1(p1Data);
            setP2(p2Data);
            return;
        }

        setP1(me);
        const opponent = data.players.find(p => p.player_id !== me.player_id);
        setP2(opponent); 
        

    }, [navigate, socket]);

    useEffect(() => {
        if (!socket) return;

        socket.on("movement", ({player_id, movement, data, players}: GameData) => {
            setP1(prev => {
                if (!prev) return prev;

                const copy = { ...prev };
                const player = players.find(p => p.player_id === copy.player_id);

                if (!player) return prev;

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

                Object.keys(copy).forEach(k => {
                    const key = k as CellKeys;

                    if (copy[key].spied) {
                        copy[key].spied = false;
                        copy[key].letter = undefined;
                    }
                });

                switch (movement) {
                    case "BLOCK":
                    case "UNBLOCK":
                        if (data.cell) {
                            const key = `${data.cell.x}-${data.cell.y}` as CellKeys;
                            copy[key] = {
                                ...copy[key],
                                blocked: { blocked_by: data.blocked_by, remaining: data.remaining },
                                actor: player_id
                            };
                        }
                        break;

                    case "TRAP":
                        if (data.cell) {
                            const key = `${data.cell.x}-${data.cell.y}` as CellKeys;
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
                        if (data.cell) {
                            const key = `${data.cell.x}-${data.cell.y}` as CellKeys;
                            copy[key] = {
                                ...copy[key],
                                letter: data.letter
                            };
                        }
                        break;

                    case "REVEAL":
                        if (data.cell) {
                            const key = `${data.cell.x}-${data.cell.y}` as CellKeys;
                            
                            if (data.status === "trapped") {
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
                                }, 10000);
                                break;
                            }

                            if (data.status === "blocked") {
                                break;
                            }

                            copy[key] = {
                                ...copy[key],
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
                    case "FREEZE":
                        if (player_id === socket.id) break;
                        
                        if (
                            p1?.powers.includes({ power: "UNFREEZE", rarity: "RARE", type: "effect" }) ||
                            p1?.powers.includes({ power: "IMMUNITY", rarity: "LEGENDARY", type: "effect" })
                        ) break;

                        async function getResult() {
                            if (!room) return;

                            const result = await PassTurn.passTurnEffect(room);
                            return result;
                        }

                        getResult();

                        break;
                }

                return copy;
            });
        });

        socket.on("game_over", ({winner}) => {
            setWinner(winner);
        })

        return () => {
            socket.off("movement");
            socket.off("game_over");
        }
    }, [socket, setP1, setP2, setCells, setFindeds]);

    const handleMovement = async (x?: number, y?: number) => {
        try {
            await fetch(`${settings.server}/game/${room}/move`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    player_id: socket.id,
                    movement: move,
                    powerIndex: moveIdx,
                    x: x,
                    y: y
                })
            });
        } catch (err) {
            console.error(err);
        }

        setMove("REVEAL");
        setMoveIdx(undefined);
    }

    if (!p1 || !p2 || !words) {
        return null;
    };

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
            
            <EffectOverlay freeze={p1.freeze.active} blind={p1.blind.active} immunity={p1.immunity.active} />
            <WinnerOverlay room_id={room} winner={winner} duration={10000} isOpen={winner ? true : false} />
        </div>
    )
}