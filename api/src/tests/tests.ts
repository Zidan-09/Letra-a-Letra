import { RoomService } from "../services/roomServices";
import { PlayerService } from "../services/playerServices";

PlayerService.createPlayer("player1", "Alex", false, 1);
PlayerService.createPlayer("player2", "Alex", false, 2);
PlayerService.createPlayer("player3", "Alex", false, 2);
PlayerService.createPlayer("player4", "Alex", false, 2);
PlayerService.createPlayer("player5", "Alex", false, 2);
PlayerService.createPlayer("player6", "Alex", false, 2);

const room = RoomService.createRoom("2", 15, true, false, "player1");

if (room !== "not_found") {
    RoomService.joinRoom(room.room_id, "player2", false);

    console.log(room.players[0]?.nickname, room.players[1]?.nickname);

    RoomService.leaveRoom(room.room_id, "player1");

    console.log(room.players[0]?.nickname, room.players[1]?.nickname)

    RoomService.joinRoom(room.room_id, "player3", false);
    RoomService.joinRoom(room.room_id, "player4", true);
    RoomService.joinRoom(room.room_id, "player5", true);
    RoomService.joinRoom(room.room_id, "player6", true);

    console.log(room.players[0]?.nickname, room.players[1]?.nickname)
    room.spectators.filter(Boolean).forEach(s => {
        console.log(s.nickname)
    })
}