import { useEffect, useRef } from "react";
import { SceneRenderer } from "../render/scene";

/** React host for the Pixi activity window: meditating while cultivating, standing otherwise. */
export function ActivityScene({ cultivating }: { cultivating: boolean }) {
  const host = useRef<HTMLDivElement>(null);
  const renderer = useRef<SceneRenderer | null>(null);

  useEffect(() => {
    const r = new SceneRenderer(host.current!);
    renderer.current = r;
    return () => {
      r.destroy();
      renderer.current = null;
    };
  }, []);

  useEffect(() => {
    void renderer.current?.setScene("courtyard", cultivating ? "meditate" : "idle", cultivating);
  }, [cultivating]);

  return <div ref={host} className="game-scene" data-testid="scene" />;
}
