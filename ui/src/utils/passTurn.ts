import settings from "../settings.json";
import type { Player } from "./room_utils";

export const PassTurn = {
    async passTurnTimer(p1: Player, room_id: string) {
        if (!p1 || !room_id) return;

        await fetch(`${settings.server}/game/${room_id}/pass`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                player_id: p1.player_id
            })
        });
    },

    async passTurnEffect(p1?: Player, room_id?: string): Promise<void> {
        if (!p1 || !room_id) return;
        if (!p1.freeze.active) return;

        if (
            p1?.powers.includes({ power: "UNFREEZE", rarity: "RARE", type: "effect" }) ||
            p1?.powers.includes({ power: "IMMUNITY", rarity: "LEGENDARY", type: "effect" })
        ) return;

        await fetch(`${settings.server}/game/${room_id}/effect/pass`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                player_id: p1.player_id
            })
        });
    },
}