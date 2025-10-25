"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
;
class Player {
    constructor(player_id, nickname, spectator, avatar) {
        this.spectator = false;
        this.turn = 0;
        this.score = 0;
        this.passed = 0;
        this.leaved = 0;
        this.ban = false;
        this.powers = [];
        this.freeze = { active: false, remaining: null };
        this.blind = { active: false, remaining: null };
        this.immunity = { active: false, remaining: null };
        this.player_id = player_id;
        this.nickname = nickname;
        this.spectator = spectator;
        this.avatar = avatar;
    }
    ;
    addScore() {
        this.score++;
    }
    ;
    addPass() {
        this.passed++;
    }
    ;
    resetPass() {
        this.passed = 0;
    }
    ;
    discardPower(powerIdx) {
        this.powers.splice(powerIdx, 1);
    }
    ;
    applyEffect(effect, duration) {
        this[effect] = { active: true, remaining: duration };
    }
    ;
    removeEffect(effect) {
        this[effect] = { active: false, remaining: null };
    }
    ;
    decrementEffect() {
        ["freeze", "blind", "immunity"].forEach((effect) => {
            if (this[effect].active && this[effect].remaining) {
                this[effect].remaining--;
                if (this[effect].remaining <= 0)
                    this.removeEffect(effect);
            }
        });
    }
    ;
    reset() {
        this.score = 0;
        this.turn = 0;
        this.resetPass();
        this.powers = [];
        ["freeze", "blind", "immunity"].forEach((effect) => {
            this.removeEffect(effect);
        });
    }
    ;
}
exports.Player = Player;
;
//# sourceMappingURL=player.js.map