import { RoomService } from "../../services/roomService";
import { getSocketInstance } from "../../socket";
import { MoveEmit, GameStarted } from "./gameEmits";
import { MovementsEnum } from "../game/movementsEnum";
import { ServerResponses } from "../responses/serverResponses";
import { GameResponses } from "../responses/gameResponses";

export const GameSocket = {
    gameStarted(room_id: string) {
        const io = getSocketInstance();

        const room = RoomService.getRoom(room_id);
        if (room === ServerResponses.NotFound || !room.players || !room.board || !room.board.words) return;

        const players = room.players;
        const spectators = room.spectators;

        const data: GameStarted = {
            words: room.board.words,
            room: {
                room_id: room.room_id,
                room_name: room.room_name,
                status: room.status,
                players: room.players,
                spectators: room.spectators,
                created_by: room.created_by,
                creator: room.creator,
                timer: room.timer,
                turn: room.turn,
                allowSpectators: room.allowSpectators,
                privateRoom: room.privateRoom
            }
        }

        const all = [...players, ...spectators];

        all.filter(Boolean).forEach(p => 
            io.to(p.player_id).emit("game_started", data)
        );
    },

    movementOne(
        room_id: string,
        player_id: string,
        movement: MovementsEnum,
        data: MoveEmit
    ) {
        const io = getSocketInstance();

        const room = RoomService.getRoom(room_id);
        if (room === ServerResponses.NotFound) return;

        const all = [...room.players, ...room.spectators];

        all.filter(Boolean).forEach(p => {
            if (p.player_id !== player_id) io.to(p.player_id).emit("movement", {
                movement: movement,
                player_id: player_id,
                data: data.status === GameResponses.TrapTrigged ? data : data.status,
                players: room.players,
                turn: room.turn
            })
        })

        io.to(player_id).emit("movement", {
            movement: movement,
            player_id: player_id,
            data: data,
            players: room.players,
            turn: room.turn
        })
    },

    movementAll(
        room_id: string,
        player_id: string,
        movement: MovementsEnum,
        data: MoveEmit
    ) {
        const io = getSocketInstance();

        const room = RoomService.getRoom(room_id);
        if (room === ServerResponses.NotFound || !room.players || !room.spectators) return;
        const players = room.players
        const spectators = room.spectators;

        const all = [...players, ...spectators];

        all.filter(Boolean).forEach(p =>
            io.to(p.player_id).emit("movement", {
                movement: movement,
                player_id: player_id,
                data: data,
                players: players,
                turn: room.turn
            })
        )
    },

    gameOver(room_id: string) {
        const io = getSocketInstance();

        const room = RoomService.getRoom(room_id);
        if (room === ServerResponses.NotFound) return;
        const players = room.players;
        const spectators = room.spectators;
        
        const winner = room.gameOver();

        if (!winner) return;

        const all = [...players, ...spectators];

        all.filter(Boolean).forEach(p =>
            io.to(p.player_id).emit("game_over", {
                winner: winner,
                room: room
            })
        )

        players.filter(Boolean).forEach(p => {
            p.reset();
        })
    }
}