"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const player_1 = require("../entities/player");
const serverResponses_1 = require("../utils/responses/serverResponses");
class PlayerServices {
    constructor() {
        this.players = new Map();
    }
    createPlayer(socket_id, nickname, spectator, avatar) {
        const player = new player_1.Player(socket_id, nickname, spectator, avatar);
        this.players.set(player.player_id, player);
        return player;
    }
    getPlayer(player_id) {
        const player = this.players.get(player_id);
        if (!player)
            return serverResponses_1.ServerResponses.NOT_FOUND;
        return player;
    }
    getAll() {
        let players = [];
        this.players.forEach((player) => {
            players.push(player);
        });
        return players;
    }
    savePlayer(player) {
        player.reset();
        this.players.set(player.player_id, player);
    }
    removePlayer(player_id) {
        const result = this.players.delete(player_id);
        return result;
    }
}
exports.PlayerService = new PlayerServices();
//# sourceMappingURL=playerService.js.map