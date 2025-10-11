import bg from "../assets/background.png";
import { avatars } from "./avatars";
import { PowerData } from "./powers";

export const Preloads = {
    preloadBackground(): Promise<void> {
        return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = bg;
        img.onload = () => resolve();
        img.onerror = reject;
        });
    },

    preloadAvatars(): Promise<void[]> {
        const promises = Object.values(avatars).map(
        src =>
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
        this.preloadAvatars(),
        this.preloadPowers(),
        ]).then(() => undefined);
    }
};