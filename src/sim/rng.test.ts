import { describe, expect, it } from "vitest";
import { nextFloat, nextInt, seedRng, type RngState } from "./rng";

function sequence(seed: number, n: number): number[] {
  let s: RngState = seedRng(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const [v, next] = nextFloat(s);
    out.push(v);
    s = next;
  }
  return out;
}

describe("rng", () => {
  it("is deterministic for a seed", () => {
    expect(sequence(42, 20)).toEqual(sequence(42, 20));
  });

  it("differs between seeds", () => {
    expect(sequence(1, 5)).not.toEqual(sequence(2, 5));
  });

  it("stays in range", () => {
    for (const v of sequence(7, 1000)) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
    let s = seedRng(3);
    for (let i = 0; i < 1000; i++) {
      const [v, next] = nextInt(s, 1, 6);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
      s = next;
    }
  });
});
