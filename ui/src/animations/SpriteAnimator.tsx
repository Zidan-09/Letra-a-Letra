import { useEffect, useRef, useState } from "react";
import type { AnimationConfig } from "./animationTypes";

type SpriteAnimatorProps = {
  config: AnimationConfig;
  onEnd: () => void;
};

export default function SpriteAnimator({ config, onEnd }: SpriteAnimatorProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [loaded, setLoaded] = useState(false);
  const frameRef = useRef(0);

  useEffect(() => {
    const img = new Image();
    img.src = config.src;

    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
    };
  }, [config]);

  useEffect(() => {
    if (!loaded) return;
    if (!canvasRef.current) return;
    if (!imgRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const interval = setInterval(() => {
      if (!imgRef.current) return;

      ctx.clearRect(0, 0, config.frameWidth, config.frameHeight);

      ctx.drawImage(
        imgRef.current,
        frameRef.current * config.frameWidth,
        0,
        config.frameWidth,
        config.frameHeight,
        0,
        0,
        config.frameWidth,
        config.frameHeight
      );

      frameRef.current++;

      if (frameRef.current >= config.frames) {
        clearInterval(interval);
        onEnd();
      }
    }, 1000 / config.fps);

    return () => clearInterval(interval);
  }, [loaded, config, onEnd]);

  return (
    <canvas
      ref={canvasRef}
      width={config.frameWidth}
      height={config.frameHeight}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
