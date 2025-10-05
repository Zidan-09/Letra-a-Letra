import { useEffect, useState } from "react";
import { useSocket } from "../services/socketProvider";
import { useNavigate } from "react-router-dom";
import { Server } from "../utils/server_utils";
import type { Game, Player, MovementsEnum, GameData, CompletedWord, CellKeys, CellUpdate } from "../utils/room_utils";
import PlayerCard from "../components/Game/PlayerCard";
import Slots from "../components/Game/Slots";
import Board from "../components/Game/Board";
import logo from "../assets/logo.svg";
import styles from "../styles/Game.module.css";
import Words from "../components/Game/Words";

export default function Game() {
    const [room, setRoom] = useState<string>();
    const [me, setMe] = useState<Player>();
    const [opponent, setOpponent] = useState<Player>();
    const [cells, setCells] = useState<Record<CellKeys, CellUpdate>>({});

    const [words, setWords] = useState<string[]>();
    const [findeds, setFindeds] = useState<CompletedWord[]>([]);

    const [move, setMove] = useState<MovementsEnum>("REVEAL");
    const [moveIdx, setMoveIdx] = useState<number | undefined>(undefined);

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
        const searchMe = data.players.filter(Boolean).find(p => p.player_id === socket.id);
        const searchOpponent = data.players.filter(Boolean).find(p => p.player_id !== socket.id);

        if (!searchMe || !searchOpponent || !wordsParsed) {
            navigate("/");
            return;
        }

        setRoom(data.room_id);
        setMe(searchMe);
        setOpponent(searchOpponent);
        setWords(wordsParsed);

    }, [navigate, socket]);

    useEffect(() => {
        if (!socket) return;

        socket.on("movement", ({player_id, movement, data}: GameData) => {
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

                return copy;
            });

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
                            setMe(prevMe => {
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
                            setOpponent(prevOppo => {
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

        return () => {
            socket.off("movement");
        }
    }, [socket, setMe, setOpponent, setCells, setFindeds])

    const handleMovement = async (x?: number, y?: number) => {
        await fetch(`${Server}/game/${room}/move`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                player_id: socket.id,
                movement: move,
                powerIndex: moveIdx ? moveIdx : undefined,
                x: x,
                y: y
            })
        })
    }

    if (!me || !opponent || !words) {
        console.log("LOADING...");
        console.log(me, opponent, words)
        return null;
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <PlayerCard player={me} />

                <img src={logo} alt="Logo" className={styles.logo} />

                <PlayerCard player={opponent} />
            </div>

            <div className={styles.game}>
                <Slots 
                playerPowers={me.powers}
                selected={moveIdx}
                selectMove={setMove}
                selectMoveIdx={setMoveIdx}
                />

                <Board
                onCellClick={handleMovement}
                cellsData={cells}
                />

                <Words
                words={words}
                findeds={findeds}
                />
            </div>
        </div>
    )
}