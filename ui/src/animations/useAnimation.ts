import { useContext } from "react";
import { AnimationContext } from "./AnimationContext";

export function useAnimation() {
  return useContext(AnimationContext);
}
