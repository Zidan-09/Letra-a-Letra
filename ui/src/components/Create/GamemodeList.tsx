import type { GameModes } from "../../utils/room_utils";
import GamemodeItem from "./GamemodeItem";

interface GamemodeListProps {
  gamemode: GameModes;
  selectGamemode: (gm: GameModes) => void;
}

const gamemodes: GameModes[] = ["NORMAL", "CRAZY"];

export default function GamemodeList({
  gamemode,
  selectGamemode,
}: GamemodeListProps) {
  return (
    <div>
      {gamemodes.map((gm, index) => (
        <GamemodeItem
          key={index}
          gamemode={gm}
          selected={gamemode}
          select={selectGamemode}
        />
      ))}
    </div>
  );
}
