import bg from "../assets/background.png";
import logo from "../assets/logo.svg";
import { avatars } from "./avatars";
import { PowerData } from "./powers";

import icon1 from "../assets/buttons/icon-back.svg";
import icon2 from "../assets/buttons/icon-ban.svg";
import icon3 from "../assets/buttons/icon-chat.svg";
import icon4 from "../assets/buttons/icon-create.svg";
import icon5 from "../assets/buttons/icon-enter.svg";
import icon6 from "../assets/buttons/icon-help.svg";
import icon7 from "../assets/buttons/icon-kick.svg";
import icon8 from "../assets/buttons/icon-play.svg";
import icon9 from "../assets/buttons/icon-refresh.svg";
import icon10 from "../assets/buttons/icon-send.svg";
import icon11 from "../assets/buttons/icon-settings.svg";
import icon12 from "../assets/buttons/icon-unban.svg";

const icons: Record<number, string> = {
    1: icon1,
    2: icon2,
    3: icon3,
    4: icon4,
    5: icon5,
    6: icon6,
    7: icon7,
    8: icon8,
    9: icon9,
    10: icon10,
    11: icon11,
    12: icon12,
}

export const Preloads = {
    preloadBackground(): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = bg;
            img.onload = () => resolve();
            img.onerror = reject;
        });
    },

    preloadLogo(): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = logo;
            img.onload = () => resolve();
            img.onerror = reject;
        });
    },

    preloadIcons(): Promise<void[]> {
        const promises = Object.values(icons).map(src =>
            new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve();
                img.onerror = reject;
            })
        );
        return Promise.all(promises);
    },

    preloadAvatars(): Promise<void[]> {
        const promises = Object.values(avatars).map(src =>
            new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve();
                img.onerror = reject;
            })
        );
        return Promise.all(promises);
    },

    preloadPowers(): Promise<void[]> {
        const promises = Object.values(PowerData).map(
        power =>
            new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.src = power.icon;
                img.onload = () => resolve();
                img.onerror = reject;
            })
        );
        return Promise.all(promises);
    },

    preloadAll(): Promise<void> {
        return Promise.all([
            this.preloadBackground(),
            this.preloadLogo(),
            this.preloadIcons(),
            this.preloadAvatars(),
            this.preloadPowers(),
        ]).then(() => undefined);
    }
};