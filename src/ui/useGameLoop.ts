import { useEffect } from "react";
import { useGameStore } from "../state/gameStore";

/** Feeds real time into the store each animation frame. A hidden tab does not catch up. */
export function useGameLoop() {
  const tick = useGameStore((s) => s.tick);
  useEffect(() => {
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      tick(Math.max(0, Math.min(0.25, (now - last) / 1000)));
      last = now;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [tick]);
}
