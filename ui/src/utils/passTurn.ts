import { useSocket } from "../services/socketProvider";
import settings from "../settings.json";

export const PassTurn = {
    async passTurnTimer(room_id: string) {
        const socket = useSocket();

        const result = await fetch(`${settings.server}/game/${room_id}/pass`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                player_id: socket.id
            })
        }).then(res => res.json()).then(data => data);

        return result.success
    },

    async passTurnEffect(room_id: string): Promise<boolean> {
        const socket = useSocket();

        const result = await fetch(`${settings.server}/game/${room_id}/effect/pass`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                player_id: socket.id
            })
        }).then(res => res.json()).then(data => data);

        return result.success
    }
}