interface PlayerEffect {
    active: boolean,
    remaining: number | null;
}

type EffectKey = "freeze" | "blind" | "immunity"

export class Player {
    player_id: string;
    nickname: string;
    spectator: boolean = false;
    turn: 0 | 1;
    avatar: number;
    score: number = 0;
    passed: number = 0;
    freeze: PlayerEffect = { active: false, remaining: null };
    blind: PlayerEffect = { active: false, remaining: null };
    immunity: PlayerEffect = { active: false, remaining: null };

    constructor(player_id: string, nickname: string, spectator: boolean, avatar: number) {
        this.player_id = player_id;
        this.nickname = nickname;
        this.spectator = spectator;
        this.turn = 0;
        this.avatar = avatar;
    }

    addScore() {
        this.score++;
    }

    addPass() {
        this.passed++;
    }

    resetPass() {
        this.passed = 0
    }

    applyEffect(effect: EffectKey, duration: number) {
        this[effect] = { active: true, remaining: duration }
    }
    
    removeEffect(effect:EffectKey) {
        this[effect] = { active: false, remaining: null }
    }

    decrementEffect() {
        (["freeze", "blind", "immunity"] as EffectKey[]).forEach((effect) => {
            if (this[effect].active && this[effect].remaining) {
                this[effect].remaining--;

                if (this[effect].remaining <= 0) this.removeEffect(effect);
            }
        });
    }
}