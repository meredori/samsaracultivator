import { describe, expect, it } from "vitest";
import { createProficiency, gainProgress, progressToNextLevel } from "./proficiency";

describe("proficiency", () => {
  it("starts at level 0 needing 100 progress", () => {
    expect(createProficiency()).toEqual({ level: 0, progress: 0 });
    expect(progressToNextLevel(0)).toBe(100);
  });

  it("follows 100 x 1.35^level rounded to the nearest 10", () => {
    const curve = Array.from({ length: 10 }, (_, l) => progressToNextLevel(l));
    expect(curve).toEqual([100, 140, 180, 250, 330, 450, 610, 820, 1100, 1490]);
    expect(curve.reduce((a, b) => a + b)).toBe(5470);
  });

  it("levels up when progress fills, carrying the rest into the next level", () => {
    expect(gainProgress(createProficiency(), 99)).toEqual({ level: 0, progress: 99 });
    expect(gainProgress(createProficiency(), 105)).toEqual({ level: 1, progress: 5 });
    expect(gainProgress(createProficiency(), 5470)).toEqual({ level: 10, progress: 0 });
  });
});
