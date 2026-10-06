import { useEffect, useRef } from "react";
import { ACTIONS } from "./data";
import { SceneRenderer } from "../render/scene";
import { useMock } from "./store";

/** React host for the Pixi activity window; follows the selected action. */
export function SceneView() {
  const host = useRef<HTMLDivElement>(null);
  const renderer = useRef<SceneRenderer | null>(null);
  const action = useMock((s) => s.action);
  const running = useMock((s) => s.running);

  useEffect(() => {
    const r = new SceneRenderer(host.current!);
    renderer.current = r;
    return () => {
      r.destroy();
      renderer.current = null;
    };
  }, []);

  useEffect(() => {
    const def = ACTIONS.find((a) => a.id === action)!;
    void renderer.current?.setScene(def.scene, def.sprite, running);
  }, [action, running]);

  return <div ref={host} className="scene-view" data-testid="mockup-scene" />;
}
