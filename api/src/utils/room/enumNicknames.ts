import { Player } from "../../entities/player";

export function enumNicknames(all: (Player | undefined)[]) {
    const playersList = all.filter((p): p is Player => Boolean(p));
    const nicknameGroups: Record<string, Player[]> = {};

    for (const player of playersList) {
        const baseName = player.nickname.replace(/\s+\d+$/, "").trim();
        player.nickname = baseName;

        if (!nicknameGroups[baseName]) nicknameGroups[baseName] = [];
        nicknameGroups[baseName].push(player);
    }

    for (const [baseName, players] of Object.entries(nicknameGroups)) {
        if (players.length > 1) {
            players.forEach((player, index) => {
                player.nickname = `${baseName} ${index + 1}`;
            });
        } else {
            players[0]!.nickname = baseName;
        }
    }
}