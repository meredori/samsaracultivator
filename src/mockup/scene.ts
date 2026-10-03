import { Application, Assets, Container, Graphics, Sprite, Texture, TextureStyle } from "pixi.js";
import { spriteUrl, type SceneKind, type SpriteKey } from "./data";

// Central activity window. Everything is drawn at a low logical resolution
// and scaled up with nearest-neighbour so it stays on a pixel grid.

export const SCENE_W = 384;
export const SCENE_H = 160;
const GROUND_Y = 146;

TextureStyle.defaultOptions.scaleMode = "nearest";

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Jagged ink-wash ridge, `width` wide, drawn twice side by side so it can scroll. */
function ridge(seed: number, width: number, baseY: number, height: number, color: number, alpha = 1) {
  const rand = mulberry32(seed);
  const g = new Graphics();
  for (let copy = 0; copy < 2; copy++) {
    const ox = copy * width;
    const pts: number[] = [ox, SCENE_H];
    let y = baseY;
    for (let x = 0; x <= width; x += 4) {
      // peaks: occasional steep climbs, otherwise drift back down
      if (rand() < 0.08) y -= height * (0.3 + rand() * 0.5);
      else y += (baseY - y) * 0.12 + (rand() - 0.5) * 3;
      y = Math.max(baseY - height, Math.min(baseY + 6, y));
      // seamless wrap: pin both ends to baseY
      const yy = x === 0 || x === width ? baseY : Math.round(y);
      pts.push(ox + x, yy);
    }
    pts.push(ox + width, SCENE_H);
    g.poly(pts).fill({ color, alpha });
  }
  return g;
}

function sky(top: number, bottom: number) {
  const g = new Graphics();
  const bands = 10;
  for (let i = 0; i < bands; i++) {
    const t = i / (bands - 1);
    const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
    const r = lerp(top >> 16, bottom >> 16);
    const gr = lerp((top >> 8) & 255, (bottom >> 8) & 255);
    const b = lerp(top & 255, bottom & 255);
    g.rect(0, Math.floor((i * SCENE_H) / bands), SCENE_W, Math.ceil(SCENE_H / bands) + 1).fill((r << 16) | (gr << 8) | b);
  }
  return g;
}

function pine(x: number, y: number, scale = 1) {
  const g = new Graphics();
  const s = (n: number) => Math.round(n * scale);
  g.rect(x - s(2), y - s(40), s(5), s(40)).fill(0x5a4130);
  g.rect(x - s(6), y - s(26), s(5), s(3)).fill(0x5a4130);
  g.rect(x + s(2), y - s(34), s(8), s(3)).fill(0x5a4130);
  const blobs: [number, number, number, number][] = [
    [-26, -52, 30, 10],
    [-4, -60, 34, 10],
    [-18, -44, 26, 8],
    [8, -42, 28, 9],
    [-10, -68, 22, 8],
    [-34, -36, 20, 7],
  ];
  for (const [bx, by, bw, bh] of blobs) {
    g.rect(x + s(bx), y + s(by), s(bw), s(bh)).fill(0x2f5a3d);
    g.rect(x + s(bx) + 2, y + s(by), s(bw) - 4, 2).fill(0x4f7d55);
  }
  return g;
}

function lantern(x: number, y: number) {
  const g = new Graphics();
  g.rect(x - 2, y - 14, 4, 14).fill(0x8b8a84);
  g.rect(x - 6, y - 20, 12, 6).fill(0x9c9b94);
  g.rect(x - 4, y - 18, 8, 3).fill(0x3e3b36);
  g.rect(x - 8, y - 24, 16, 4).fill(0x6d6c66);
  g.rect(x - 5, y, 10, 2).fill(0x6d6c66);
  return g;
}

function rock(x: number, y: number, w: number, h: number) {
  const g = new Graphics();
  g.rect(x, y - h, w, h).fill(0x7b7a74);
  g.rect(x + 2, y - h, w - 4, 2).fill(0xa3a29b);
  g.rect(x, y - 3, w, 3).fill(0x55544f);
  return g;
}

interface Particle {
  g: Graphics;
  vx: number;
  vy: number;
  life: number;
  kind: "leaf" | "qi" | "ember";
}

export class SceneRenderer {
  private app = new Application();
  private ready: Promise<void>;
  private world = new Container();
  private far = new Container();
  private mid = new Container();
  private props = new Container();
  private fx = new Container();
  private hero = new Sprite(Texture.EMPTY);
  private particles: Particle[] = [];
  private waterfall?: Graphics;
  private fire?: Graphics;
  private kind: SceneKind = "courtyard";
  private spriteKey: SpriteKey = "idle";
  private running = true;
  private t = 0;
  private destroyed = false;
  private rand = mulberry32(7);

  private host: HTMLElement;

  constructor(host: HTMLElement) {
    this.host = host;
    this.ready = this.init();
  }

  private async init() {
    await this.app.init({
      width: SCENE_W,
      height: SCENE_H,
      background: 0xeef0ea,
      antialias: false,
      resolution: 1,
      autoDensity: false,
    });
    if (this.destroyed) {
      this.app.destroy(true);
      return;
    }
    const canvas = this.app.canvas;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.imageRendering = "pixelated";
    this.host.appendChild(canvas);

    this.hero.anchor.set(0.5, 1);
    this.world.addChild(this.far, this.mid, this.props, this.hero, this.fx);
    this.app.stage.addChild(this.world);
    await Assets.load(
      (["idle", "meditate", "explore", "train", "contemplate", "combat"] as SpriteKey[]).map(spriteUrl),
    );
    this.build();
    this.app.ticker.add((tk) => this.update(tk.deltaMS / 1000));
  }

  async setScene(kind: SceneKind, sprite: SpriteKey, running: boolean) {
    await this.ready;
    if (this.destroyed) return;
    const rebuild = kind !== this.kind;
    this.kind = kind;
    this.spriteKey = sprite;
    this.running = running;
    if (rebuild) this.build();
    this.hero.texture = Assets.get(spriteUrl(sprite));
  }

  destroy() {
    this.destroyed = true;
    // init may still be pending; Application.destroy is only safe after it
    this.ready.then(() => {
      if (this.app.renderer) this.app.destroy(true, { children: true });
    });
  }

  private build() {
    for (const c of [this.far, this.mid, this.props, this.fx]) c.removeChildren().forEach((ch) => ch.destroy());
    this.particles = [];
    this.waterfall = undefined;
    this.fire = undefined;
    this.far.x = this.mid.x = 0;

    const k = this.kind;
    this.far.addChild(sky(k === "camp" ? 0xd9d2c4 : 0xe9ece6, k === "camp" ? 0xf1e4cc : 0xd5dee0));
    this.far.addChild(ridge(11, SCENE_W, 92, 60, 0xb9c3c6, 0.9));
    this.mid.addChild(ridge(23, SCENE_W, 112, 40, 0x8e9c9e, 0.95));
    this.mid.addChild(ridge(37, SCENE_W, 128, 26, 0x6f7f78));

    const ground = new Graphics();
    const groundTop = k === "training" ? 0x9a8467 : k === "camp" ? 0x7c6a52 : 0x7d8a63;
    ground.rect(0, GROUND_Y - 6, SCENE_W, SCENE_H).fill(groundTop);
    ground.rect(0, GROUND_Y - 6, SCENE_W, 2).fill(0x9fae7c);
    for (let i = 0; i < 40; i++) {
      ground.rect(Math.floor(this.rand() * SCENE_W), GROUND_Y - 4 + Math.floor(this.rand() * 14), 3, 1).fill(0x5d6a48);
    }
    this.props.addChild(ground);

    if (k === "courtyard") {
      // waterfall cliff on the right, pavilion silhouette above it
      const cliff = new Graphics();
      cliff.rect(300, 40, 70, GROUND_Y - 40).fill(0x6b7570);
      cliff.rect(296, 60, 8, 80).fill(0x58625d);
      cliff.rect(312, 22, 44, 18).fill(0x4a4f52);
      cliff.rect(306, 18, 56, 5).fill(0x2f3437);
      cliff.rect(318, 8, 32, 10).fill(0x4a4f52);
      cliff.rect(314, 5, 40, 4).fill(0x2f3437);
      this.props.addChild(cliff);
      this.waterfall = new Graphics();
      this.props.addChild(this.waterfall);
      this.props.addChild(pine(70, GROUND_Y - 4, 1.1));
      const plat = new Graphics();
      plat.rect(150, GROUND_Y - 10, 84, 10).fill(0x8c8b85);
      plat.rect(150, GROUND_Y - 10, 84, 2).fill(0xb4b3ab);
      plat.rect(142, GROUND_Y - 4, 100, 6).fill(0x6f6e69);
      this.props.addChild(plat);
      this.props.addChild(lantern(124, GROUND_Y - 2), lantern(262, GROUND_Y - 2));
      this.props.addChild(rock(18, GROUND_Y, 22, 10), rock(276, GROUND_Y, 18, 8));
    } else if (k === "training") {
      this.props.addChild(pine(40, GROUND_Y - 4, 0.9), pine(330, GROUND_Y - 4, 1));
      const rack = new Graphics();
      rack.rect(270, GROUND_Y - 30, 3, 30).fill(0x5a4130);
      rack.rect(294, GROUND_Y - 30, 3, 30).fill(0x5a4130);
      rack.rect(266, GROUND_Y - 30, 36, 3).fill(0x6e523d);
      rack.rect(276, GROUND_Y - 26, 2, 24).fill(0xa0a4a8);
      rack.rect(284, GROUND_Y - 26, 2, 24).fill(0x8b6a3e);
      this.props.addChild(rack);
      this.props.addChild(rock(90, GROUND_Y, 14, 6));
    } else if (k === "trail") {
      const path = new Graphics();
      path.rect(0, GROUND_Y - 2, SCENE_W * 2, 8).fill(0xb3a17f);
      this.mid.addChild(path);
      this.mid.addChild(pine(60, GROUND_Y - 4, 0.8), pine(250, GROUND_Y - 4, 1.1));
      this.mid.addChild(pine(60 + SCENE_W, GROUND_Y - 4, 0.8), pine(250 + SCENE_W, GROUND_Y - 4, 1.1));
      this.mid.addChild(rock(150, GROUND_Y, 16, 7), rock(150 + SCENE_W, GROUND_Y, 16, 7));
    } else if (k === "camp") {
      this.props.addChild(pine(330, GROUND_Y - 4, 1));
      const logs = new Graphics();
      logs.rect(232, GROUND_Y - 4, 22, 4).fill(0x5a4130);
      logs.rect(236, GROUND_Y - 7, 14, 3).fill(0x6e523d);
      this.props.addChild(logs);
      this.fire = new Graphics();
      this.props.addChild(this.fire);
      this.props.addChild(rock(60, GROUND_Y, 26, 12));
    }

    this.hero.position.set(k === "training" ? 170 : 192, GROUND_Y - (k === "courtyard" ? 8 : 0));
  }

  private spawn(kind: Particle["kind"]) {
    const g = new Graphics();
    if (kind === "leaf") g.rect(0, 0, 2, 1).fill(this.rand() < 0.5 ? 0xc0772e : 0x8a9a3c);
    else if (kind === "qi") g.rect(0, 0, 1, 1).fill({ color: 0x9fe0d2, alpha: 0.9 });
    else g.rect(0, 0, 1, 1).fill(0xffb24a);
    const p: Particle = { g, kind, vx: 0, vy: 0, life: 0 };
    if (kind === "leaf") {
      g.position.set(this.rand() * SCENE_W, -2);
      p.vx = 6 + this.rand() * 8;
      p.vy = 8 + this.rand() * 6;
      p.life = 14;
    } else if (kind === "qi") {
      g.position.set(this.hero.x - 24 + this.rand() * 48, this.hero.y - this.rand() * 20);
      p.vy = -(6 + this.rand() * 8);
      p.life = 3 + this.rand() * 2;
    } else {
      g.position.set(240 + this.rand() * 8, GROUND_Y - 10);
      p.vx = (this.rand() - 0.5) * 6;
      p.vy = -(10 + this.rand() * 10);
      p.life = 1.2;
    }
    this.fx.addChild(g);
    this.particles.push(p);
  }

  private update(dt: number) {
    this.t += dt;
    const live = this.running;
    const speed = live ? 1 : 0;

    // hero motion
    const bob = (n: number, period: number) => Math.round(Math.sin((this.t * Math.PI * 2) / period) * n);
    this.hero.pivot.set(0, 0);
    if (this.spriteKey === "meditate") this.hero.pivot.y = live ? bob(1, 3) : 0;
    else if (this.spriteKey === "train") this.hero.pivot.x = live && Math.sin(this.t * 9) > 0.7 ? -2 : 0;
    else if (this.spriteKey === "explore") this.hero.pivot.y = live ? Math.abs(bob(1, 0.6)) : 0;

    // parallax while exploring
    if (this.kind === "trail") {
      this.far.children[1].x = -((this.t * 4 * speed) % SCENE_W);
      this.mid.x = -((this.t * 24 * speed) % SCENE_W);
    }

    if (this.waterfall) {
      const w = this.waterfall;
      w.clear();
      w.rect(318, 40, 16, GROUND_Y - 44).fill(0xd8eef2);
      for (let y = 40; y < GROUND_Y - 4; y += 6) {
        const off = Math.floor((y + this.t * 40) % 12);
        w.rect(320 + (off % 3) * 4, y + (off % 6), 2, 4).fill(0x9fc9d6);
      }
      w.rect(310, GROUND_Y - 8, 32, 4).fill(0xeef8fa);
    }

    if (this.fire) {
      const f = this.fire;
      f.clear();
      const flick = Math.floor(this.t * 8) % 3;
      f.rect(238, GROUND_Y - 12 - flick, 10, 6 + flick).fill(0xe8742a);
      f.rect(240, GROUND_Y - 16 - flick, 6, 6).fill(0xf6b443);
      f.rect(242, GROUND_Y - 18 - flick, 2, 3).fill(0xfde08a);
    }

    // particles
    if (this.rand() < dt * 1.2) this.spawn("leaf");
    if (live && (this.kind === "courtyard" || this.spriteKey === "meditate") && this.rand() < dt * 10) this.spawn("qi");
    if (this.fire && this.rand() < dt * 6) this.spawn("ember");
    this.particles = this.particles.filter((p) => {
      p.life -= dt;
      p.g.x += p.vx * dt;
      p.g.y += p.vy * dt;
      if (p.kind === "leaf") p.g.x += Math.sin(this.t * 3 + p.g.y) * 0.3;
      p.g.position.set(p.g.x, p.g.y);
      if (p.life <= 0 || p.g.y > SCENE_H || p.g.x > SCENE_W) {
        p.g.destroy();
        return false;
      }
      return true;
    });
  }
}
