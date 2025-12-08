// src/animation/AnimationProvider.tsx
import { useState } from "react";
import { AnimationContext, type AnimationContextValue } from "./AnimationContext";
import SpriteAnimator from "./SpriteAnimator";
import { animations } from "./animations";

type AnimationProviderProps = {
  children: React.ReactNode;
};

export function AnimationProvider({ children }: AnimationProviderProps) {
  const [queue, setQueue] = useState<(keyof typeof animations)[]>([]);

  const play: AnimationContextValue["play"] = (name) => {
    if (!animations[name]) {
      console.warn("Animation not found:", name);
      return "";
    }

    const id = crypto.randomUUID();

    setQueue((prev) => [...prev, name]);
    return id;
  };

  const stop: AnimationContextValue["stop"] = () => {

  };

  const stopAll: AnimationContextValue["stopAll"] = () => {
    setQueue([]);
  };

  const handleAnimationEnd = () => {
    setQueue((prev) => prev.slice(1));
  };

  return (
    <AnimationContext.Provider value={{ play, stop, stopAll }}>
      {children}

      {queue.length > 0 && (
        <SpriteAnimator
          config={animations[queue[0]]}
          onEnd={handleAnimationEnd}
        />
      )}
    </AnimationContext.Provider>
  );
}
