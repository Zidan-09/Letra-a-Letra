import { MovementsEnum } from "../utils/game/movementsEnum";
import { PowerRarity } from "../utils/cell/powerRarity";

interface PlayerEffect {
  active: boolean;
  remaining: number | null;
}

type EffectKey = "freeze" | "blind" | "immunity";

export class Player {
  player_id: string;
  nickname: string;
  spectator: boolean = false;
  turn: 0 | 1 = 0;
  avatar: number;
  score: number = 0;
  passed: number = 0;
  leaved: number = 0;
  timeOut?: NodeJS.Timeout;
  ban: boolean = false;
  powers: {
    power: MovementsEnum;
    rarity: PowerRarity;
    type: "manipulation" | "effect";
  }[] = [];
  freeze: PlayerEffect = { active: false, remaining: null };
  blind: PlayerEffect = { active: false, remaining: null };
  immunity: PlayerEffect = { active: false, remaining: null };

  constructor(
    player_id: string,
    nickname: string,
    spectator: boolean,
    avatar: number
  ) {
    this.player_id = player_id;
    this.nickname = nickname;
    this.spectator = spectator;
    this.avatar = avatar;
  }

  addScore() {
    this.score++;
  }

  addPass() {
    this.passed++;
  }

  resetPass() {
    this.passed = 0;
  }

  discardPower(powerIdx: number) {
    this.powers.splice(powerIdx, 1);
  }

  applyEffect(effect: EffectKey, duration: number) {
    this[effect] = { active: true, remaining: duration };
  }

  removeEffect(effect: EffectKey) {
    this[effect] = { active: false, remaining: null };
  }

  decrementEffect() {
    (["freeze", "blind", "immunity"] as EffectKey[]).forEach((effect) => {
      if (this[effect].active && this[effect].remaining) {
        this[effect].remaining--;

        if (this[effect].remaining <= 0) this.removeEffect(effect);
      }
    });
  }

  reset() {
    this.score = 0;
    this.turn = 0;
    this.resetPass();
    this.powers = [];
    (["freeze", "blind", "immunity"] as EffectKey[]).forEach((effect) => {
      this.removeEffect(effect);
    });
  }
}
