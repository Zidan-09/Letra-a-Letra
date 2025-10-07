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

        socket.on("movement", ({player_id, movement, powerIdx, data}: GameData) => {
            setCells(prev => {
                const copy = { ...prev };

                if (data.cell) {
                    const key = `${data.cell.x}-${data.cell.y}` as CellKeys;

                    copy[key] = {
                        ...copy[key],
                        x: data.cell.x,
                        y: data.cell.y,
                        letter: data.letter,
                        power: data.power,
                        blocked: { blocked_by: data.blocked_by, remaining: data.remaining },
                        trapped_by: data.trapped_by,
                        actor: player_id
                    }
                }

                if (movement === "DETECT_TRAPS" && data.traps) {
                    data.traps.forEach(trap => {
                        const key = `${trap.x}-${trap.y}` as CellKeys;
                        copy[key] = {
                            ...copy[key],
                            x: trap.x,
                            y: trap.y,
                        };
                    });
                }

                if (data.completedWord) {
                    const find = {
                        finded_by: player_id,
                        finded: data.completedWord.word,
                        positions: data.completedWord.positions
                    }

                    setFindeds(prev => [...prev, find]);

                    for (let i of find.positions) {
                        const key = `${i[0]}-${i[1]}` as CellKeys;

                        copy[key] = {
                            ...copy[key],
                            x: i[0],
                            y: i[1],
                            finded_by: player_id
                        }
                    }
                }

                return copy;
            });

            const isMe = socket.id === player_id;

            if (isMe) {
                setP1(prevMe => {
                    if (!prevMe || powerIdx === undefined) return prevMe;

                    return {
                        ...prevMe,
                        powers: prevMe.powers.filter((_, i) => i !== powerIdx)
                    }
                })
            } else {
                setP2(prevOppo => {
                    if (!prevOppo || powerIdx === undefined) return prevOppo;

                    return {
                        ...prevOppo,
                        powers: prevOppo.powers.filter((_, i) => i !== powerIdx)
                    }
                })
            }

            switch (movement) {
                case "REVEAL":
                    if (data.completedWord) {
                        const find = {
                            finded_by: player_id,
                            finded: data.completedWord.word,
                            positions: data.completedWord.positions
                        }

                        setFindeds(prev => [...prev, find]);
                    }

                    if (data.power?.hasPowerup) {
                        const isMe = socket.id === player_id;

                        if (!data.power.powerup || !data.power.rarity) break;

                        const newPower = { power: data.power.powerup, rarity: data.power.rarity };

                        if (isMe) {
                            setP1(prevMe => {
                                if (!prevMe) return prevMe;

                                return {
                                    ...prevMe,
                                    powers: [
                                        ...prevMe.powers,
                                        newPower
                                    ]
                                };
                            });
                        } else {
                            setP2(prevOppo => {
                                if (!prevOppo) return prevOppo;

                                return {
                                    ...prevOppo,
                                    powers: [
                                        ...prevOppo.powers,
                                        newPower
                                    ]
                                };
                            });
                        }
                    }

                    break;
                    
                case "BLOCK":
                case "UNBLOCK":
                case "TRAP":
                case "DETECT_TRAPS":
                case "FREEZE":
                case "UNFREEZE":
                case "SPY":
                case "BLIND":
                case "LANTERN":
                case "IMMUNITY":
            }
        });

        socket.on("game_over", ({winner}) => {
            setWinner(winner);
        })

        return () => {
            socket.off("movement");
            socket.off("game_over");
        }
    }, [socket, setP1, setP2, setCells, setFindeds])

    const handleMovement = async (x?: number, y?: number) => {
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
        })

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
                    />
                ) : (
                    <div></div>
                )}

                <Board
                cellsData={cells}
                onCellClick={p1.player_id === socket.id ? handleMovement : undefined}
                />

                <Words
                words={words}
                findeds={findeds}
                />
            </div>

            <WinnerOverlay room_id={room} winner={winner} duration={10000} isOpen={winner ? true : false} />
        </div>
    )
}