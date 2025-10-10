import { RoomService } from "../services/roomServices";
import { PlayerService } from "../services/playerServices";

PlayerService.createPlayer("player1", "CRIADOR 2", false, 1);

const room = RoomService.createRoom("2", 15, true, false, "player1");

if (room === "not_found") {
    console.log("NOT FOUND");

} else {
    console.log('Room created:', room.room_id);
    
    console.log('Public rooms:', RoomService.getPublicRooms());
    
    const deleted = RoomService.closeRoom(room.room_id);
    console.log('Deleted:', deleted);
    
    console.log('Public rooms:', RoomService.getPublicRooms());
};