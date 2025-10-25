import { Player } from "../../entities/player";

export const Ban = {
  setPlayerTimeout(player: Player) {
    this.removePlayerTimeout(player);
    player.ban = true;

    player.timeOut = setTimeout(() => {
      player.ban = false;
    }, 30 * 1000 * 60);
  },

  setBan(player: Player) {
    player.ban = true;
  },

  removePlayerTimeout(player: Player) {
    if (player.timeOut) clearTimeout(player.timeOut);
  },

  removeBan(player: Player) {
    player.ban = false;
  },
};