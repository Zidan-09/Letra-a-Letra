import { useState, useEffect } from "react";
import { useSocket } from "../services/socketProvider";
import { useNavigate } from "react-router-dom";
import settings from "../settings.json";
import {
  type CloseReasons,
  type Game,
  type GameModes,
  type MovementsEnum,
  type RoomSettings,
  type StartData,
} from "../utils/room_utils";
import PlayerList from "../components/Lobby/PlayerList";
import ChatPopup from "../components/Lobby/ChatPopup";
import SpectatorsList from "../components/Lobby/SpectatorsList";
import iconBack from "../assets/buttons/icon-back.svg";
import iconPlay from "../assets/buttons/icon-play.svg";
import iconSettings from "../assets/buttons/icon-settings.svg";
import iconChat from "../assets/buttons/icon-chat.svg";
import styles from "../styles/Lobby.module.css";
import SettingsPopup from "../components/Create/SettingsPopup";
import ActionPopup from "../components/Lobby/ActionPopup";
import Countdown from "../components/Lobby/CountDown";

export default function Lobby() {
  const [room, setRoom] = useState<Game | null>(null);
  const [creator, setCreator] = useState<string>();
  const [isChatOpen, setChatOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<string>();
  const [waiting, setWaiting] = useState<boolean>(false);

  const socket = useSocket();
  const navigate = useNavigate();

  const [theme, setTheme] = useState<string>("random");
  const [allowedPowers, setAllowedPowers] = useState<MovementsEnum[]>([
    "REVEAL",
  ]);
  const [gamemode, setGamemode] = useState<GameModes>("NORMAL");

  const [removedType, setRemovedType] = useState<"ban" | "kick" | undefined>(undefined);

  const [isCounting, setCounting] = useState(false);
  const [startData, setStartData] = useState<StartData | null>(null);

  useEffect(() => {
    const game = localStorage.getItem("game");
    const storedSettings = localStorage.getItem("settings");

    if (!game) {
      navigate("/");
      return;
    };

    const gameData: Game = JSON.parse(game);
    setRoom(gameData);

    const creatorData = [...gameData.players, ...gameData.spectators]
      .filter(Boolean)
      .find((c) => c.player_id === gameData.created_by);

    if (creatorData) {
      setCreator(creatorData.player_id);
    }

    if (storedSettings) {
      const parsed: RoomSettings = JSON.parse(storedSettings);
      setTheme(parsed.theme);
      setGamemode(parsed.gamemode as GameModes);
      setAllowedPowers(parsed.allowedPowers);
    }

    if (!socket) return;

    socket.on("game_started", (startData: StartData) => {
      setWaiting(false);
      setStartData(startData);
      setCounting(true);
    });

    socket.on("player_joined", (updatedRoom: Game) => {
      setWaiting(false);
      setRoom({
        ...updatedRoom,
        players: [...updatedRoom.players],
        spectators: [...updatedRoom.spectators],
      });
    });

    socket.on("player_left", (updatedRoom: Game) => {
      setWaiting(false);
      setRoom({
        ...updatedRoom,
        players: [...updatedRoom.players],
        spectators: [...updatedRoom.spectators],
      });
      setCreator(updatedRoom.created_by);
    });

    socket.on("role_changed", (updatedRoom: Game) => {
      setWaiting(false);
      setRoom({
        ...updatedRoom,
        players: [...updatedRoom.players],
        spectators: [...updatedRoom.spectators],
      });
    });

    socket.on("room_closed", (reason: CloseReasons) => {
      alert(
        `Sala fechada por ${
          reason == "time_out" ? "inatividade" : "falta de jogadores"
        }`
      );
      navigate("/");
    });

    socket.on("kicked", ({ room, player }) => {
      setWaiting(false);
      setRoom({
        ...room,
        players: [...room.players],
        spectators: [...room.spectators],
      });

      if (player === socket.id) setRemovedType("kick");

    });

    socket.on("banned", ({ room, player }) => {
      setWaiting(false);
      setRoom({
        ...room,
        players: [...room.players],
        spectators: [...room.spectators],
      });

      if (player === socket.id) setRemovedType("ban");
      
    });

    return () => {
      socket.off("player_joined");
      socket.off("player_left");
      socket.off("role_changed");
      socket.off("game_started");
      socket.off("room_closed");
      socket.off("kicked");
      socket.off("banned");
    };
  }, [socket, creator, navigate]);

  const checkRoomExists = async () => {
    if (!room?.room_id) return false;
    const valid = await fetch(`${settings.server}/room/${room.room_id}`)
        .then(res => res.json())
        .then(data => data);
    return valid.success;
  };

  const handleChat = () => {
    setChatOpen(true);
    setUnreadMessages(0);
  };

  const handleNewMessage = () => {
    if (!isChatOpen) {
      setUnreadMessages((prev) => prev + 1);
    }
  };

  const handleSettings = () => {
    setSettingsOpen(true);
  };

  const handleBack = async () => {
    if (waiting) return null;
    setWaiting(true);

    const valid = await checkRoomExists();
    if (!valid) return navigate("/");

    async function leaveRoom() {
      const result = await fetch(
        `${settings.server}/room/${room?.room_id}/players/${socket.id}`,
        {
          method: "DELETE",
        }
      )
        .then((res) => res.json())
        .then((data) => data);

      if (!result.success) console.warn(result);

      return result;
    };

    const result = await leaveRoom();

    if (!result.success) return null;

    return navigate("/room");
  };

  const handlePlay = async () => {
    if (
      !room ||
      room.players.filter(Boolean).length < 2 ||
      !theme ||
      !gamemode ||
      !allowedPowers
    ) return null;

    if (waiting) return;
    setWaiting(true);

    const valid = await checkRoomExists();
    if (!valid) return navigate("/");

    await fetch(
      `${settings.server}/game/${room.room_id}/start`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          theme: theme,
          gamemode: gamemode,
          allowedPowers: allowedPowers,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => data);
  };

  const handleRemovePlayer = async (ban: boolean) => {
    if (waiting) return;
    setWaiting(true);

    if (!selectedPlayer || !room) return;

    const valid = await checkRoomExists();
    if (!valid) return navigate("/");

    try {
      await fetch(
        `${settings.server}/room/${room.room_id}/players/${selectedPlayer}/remove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            banned: ban,
          }),
        }
      );
    } catch (err) {
      console.error(err);
    };
  };

  const handleUnbanPlayer = async (player_id: string) => {
    if (waiting) return;
    setWaiting(true);
    
    if (!room) return;

    const valid = await checkRoomExists();
    if (!valid) return navigate("/");

    try {
      const result = await fetch(
        `${settings.server}/room/${room.room_id}/players/${player_id}/unban`,
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((data) => data);

      if (!result.success) return;

      setRoom(result.data);

    } catch (err) {
      console.error(err);
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <p>CÓDIGO DA SALA</p>
        <div className={styles.top}>
          {socket && creator && socket.id === creator ? (
            <button
              className={styles.settings}
              onClick={handleSettings}
              type="button"
            >
              <img src={iconSettings} alt="Settings" className={styles.icons} />
            </button>
          ) : (
            <div className={styles.space}></div>
          )}

          <div className={styles.codecontainer}>
            <h2 className={styles.code}>{room?.room_id}</h2>
          </div>

          <button className={styles.chat} onClick={handleChat} type="button">
            <img src={iconChat} alt="Chat" className={styles.icons} />
            {unreadMessages > 0 && (
              <span className={styles.notificationDot}></span>
            )}
          </button>
        </div>
        {room && (
          <>
            <section className={styles.players}>
              <p>JOGADORES NA SALA</p>
              <PlayerList room={room} />
            </section>

            <section className={styles.spectators}>
              <p>ESPECTADORES</p>
              <SpectatorsList room={room} />
            </section>

            <div className={styles.buttons}>
              <button
                onClick={handleBack}
                className={`${styles.button} ${styles.back}`}
                type="button"
              >
                <img src={iconBack} alt="Back" className={styles.icon} />
                Sair
              </button>

              {socket && creator && socket.id === creator && (
                <button
                  onClick={handlePlay}
                  className={`${styles.button} ${
                    room.players.filter(Boolean).length >= 2
                      ? styles.play
                      : styles.disabled
                  }`}
                  type="button"
                >
                  <img src={iconPlay} alt="Play" className={styles.icon} />
                  Jogar
                </button>
              )}
            </div>
          </>
        )}
      </div>
      {theme &&
        gamemode &&
        allowedPowers &&
        socket &&
        creator &&
        socket.id === creator && (
          <SettingsPopup
            theme={theme}
            setTheme={setTheme}
            gamemode={gamemode}
            setGamemode={setGamemode}
            allowedPowers={allowedPowers}
            setAllowedPowers={setAllowedPowers}
            isOpen={isSettingsOpen}
            onClose={() => setSettingsOpen(false)}
          />
        )}
      {room && (
        <ChatPopup
          room_id={room?.room_id}
          nickname={
            [...room.players, ...room.spectators]
              .filter(Boolean)
              .find((p) => p.player_id === socket.id)?.nickname
          }
          local="lobby"
          created_by={room.created_by}
          players={[...room.players, ...room.spectators]}
          banneds={[...room.bannedPlayers]}
          selectedPlayer={selectedPlayer}
          selectPlayer={setSelectedPlayer}
          remove={handleRemovePlayer}
          unban={handleUnbanPlayer}
          isOpen={isChatOpen}
          onClose={() => {
            setChatOpen(false);
          }}
          onNewMessage={handleNewMessage}
        />
      )}

      {removedType && <ActionPopup type={removedType} onClose={() => setRemovedType(undefined)} />}

      {isCounting && (
        <Countdown
          start={3}
          onFinish={() => {
            if (startData) {
              const { words, room } = startData;
              localStorage.setItem("words", JSON.stringify(words));
              localStorage.setItem("game", JSON.stringify(room));
              navigate(`/game/${room.room_id}`);
            }
          }}
        />
      )}
    </div>
  );
};