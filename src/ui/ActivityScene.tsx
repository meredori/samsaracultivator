import { useEffect, useRef } from "react";
import { SCENE_W, SceneRenderer } from "../render/scene";
import type { SceneKind, SpriteKey } from "../render/sprites";
import type { Activity } from "../sim";

/** How each activity is staged: the backdrop, the sprite and where the character stands. */
const STAGING: Record<Activity, { kind: SceneKind; sprite: SpriteKey; heroX?: number }> = {
  idle: { kind: "courtyard", sprite: "idle", heroX: 140 },
  rest: { kind: "courtyard", sprite: "meditate" },
  // the training sprite strikes a post on its right, so it stands just left of the tree
  train: { kind: "courtyard", sprite: "train", heroX: 40 },
  explore: { kind: "trail", sprite: "explore" },
};

/** Logical height of the game's scene: a little more sky than the mockup's strip. */
const HEIGHT = 180;

/** React host for the Pixi activity window. */
export function ActivityScene({ activity }: { activity: Activity }) {
  const host = useRef<HTMLDivElement>(null);
  const renderer = useRef<SceneRenderer | null>(null);

  useEffect(() => {
    const r = new SceneRenderer(host.current!, HEIGHT);
    renderer.current = r;
    return () => {
      r.destroy();
      renderer.current = null;
    };
  }, []);

  useEffect(() => {
    const { kind, sprite, heroX } = STAGING[activity];
    void renderer.current?.setScene(kind, sprite, activity !== "idle", heroX);
  }, [activity]);

  return (
    <div ref={host} className="game-scene" style={{ aspectRatio: `${SCENE_W} / ${HEIGHT}` }} data-testid="scene" />
  );
}
