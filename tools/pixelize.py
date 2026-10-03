"""Reduce upscaled AI pixel-art concepts back to a native pixel grid.

The concept sprites in art/concepts are ~1254px renders where one "art pixel"
is roughly 10-11 screen pixels. For each output cell we take the dominant
opaque colour (or transparent if most of the cell is empty), then crop to the
content bounds. Result is a small PNG meant for integer nearest-neighbour
scaling in the game.

Usage: python3 tools/pixelize.py [cell_size]
"""

import sys
from collections import Counter
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "art" / "concepts"
OUT = ROOT / "src" / "assets" / "sprites"
CELL = float(sys.argv[1]) if len(sys.argv) > 1 else 10.5


def pixelize(path: Path) -> Image.Image:
    im = Image.open(path).convert("RGBA")
    w, h = im.size
    px = im.load()
    ow, oh = int(w / CELL), int(h / CELL)
    out = Image.new("RGBA", (ow, oh), (0, 0, 0, 0))
    opx = out.load()
    for oy in range(oh):
        for ox in range(ow):
            x0, y0 = int(ox * CELL), int(oy * CELL)
            x1, y1 = int((ox + 1) * CELL), int((oy + 1) * CELL)
            # sample the inner part of the cell to avoid bleeding neighbours
            m = max(1, int(CELL * 0.2))
            colours = Counter()
            empty = 0
            for y in range(y0 + m, y1 - m):
                for x in range(x0 + m, x1 - m):
                    r, g, b, a = px[x, y]
                    if a < 128:
                        empty += 1
                    else:
                        colours[(r >> 3 << 3, g >> 3 << 3, b >> 3 << 3)] += 1
            total = empty + sum(colours.values())
            if not colours or empty > total * 0.5:
                continue
            opx[ox, oy] = (*colours.most_common(1)[0][0], 255)
    bbox = out.getbbox()
    return out.crop(bbox) if bbox else out


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for path in sorted(SRC.glob("sprite-*.png")):
        name = path.stem.removeprefix("sprite-")
        img = pixelize(path)
        img.save(OUT / f"{name}.png")
        print(f"{name}: {img.size[0]}x{img.size[1]}")


if __name__ == "__main__":
    main()
