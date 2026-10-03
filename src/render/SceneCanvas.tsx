import { Application, Graphics, TextureStyle } from "pixi.js";
import { useEffect, useRef } from "react";

// Pixel art must never be smoothed; display scaling is integer nearest-neighbour.
TextureStyle.defaultOptions.scaleMode = "nearest";

const LOGICAL_WIDTH = 256;
const LOGICAL_HEIGHT = 128;
const SCALE = 3;

/** Central activity window. Draws a placeholder cultivator until real sprites land. */
export function SceneCanvas() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const app = new Application();
    let disposed = false;

    void app
      .init({
        width: LOGICAL_WIDTH * SCALE,
        height: LOGICAL_HEIGHT * SCALE,
        background: "#f4ecd8",
        antialias: false,
        roundPixels: true,
      })
      .then(() => {
        if (disposed) {
          app.destroy(true);
          return;
        }
        host.current?.appendChild(app.canvas);
        const world = new Graphics()
          .rect(0, 100, LOGICAL_WIDTH, 28)
          .fill("#d9ccab")
          // placeholder meditating cultivator, ~64x64 logical per the asset plan
          .rect(112, 68, 32, 32)
          .fill("#5b6b7a")
          .rect(120, 52, 16, 16)
          .fill("#e8c9a0");
        world.scale.set(SCALE);
        app.stage.addChild(world);
      });

    return () => {
      disposed = true;
      if (app.renderer) app.destroy(true);
    };
  }, []);

  return <div ref={host} className="scene" data-testid="scene" />;
}
