import { createContext } from "react";
import { animations } from "./animations";

export type AnimationName = keyof typeof animations;

export type EffectPayload = Record<string, any>;

export type AnimationContextValue = {
  play: (name: AnimationName, payload?: EffectPayload) => string;
  stop: (id: string) => void;
  stopAll: () => void;
};

export const AnimationContext = createContext<AnimationContextValue>({
  play: () => "",
  stop: () => {},
  stopAll: () => {},
});
