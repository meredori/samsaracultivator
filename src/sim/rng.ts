// Seeded PRNG (sfc32) so a Lower Realm can be regenerated exactly from its seed.
// State is a plain tuple so it can live in game state and be saved.

export type RngState = [number, number, number, number];

export function seedRng(seed: number): RngState {
  // splitmix32 to spread a single integer seed across the four state words
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x9e3779b9) >>> 0;
    let z = s;
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b);
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35);
    return (z ^ (z >>> 16)) >>> 0;
  };
  return [next(), next(), next(), next()];
}

/** Returns a float in [0, 1) and the advanced state. */
export function nextFloat(state: RngState): [number, RngState] {
  let [a, b, c, d] = state;
  const t = (((a + b) >>> 0) + d) >>> 0;
  d = (d + 1) >>> 0;
  a = b ^ (b >>> 9);
  b = (c + (c << 3)) >>> 0;
  c = ((c << 21) | (c >>> 11)) >>> 0;
  c = (c + t) >>> 0;
  return [t / 4294967296, [a >>> 0, b, c, d]];
}

/** Returns an integer in [min, max] (inclusive) and the advanced state. */
export function nextInt(state: RngState, min: number, max: number): [number, RngState] {
  const [f, s] = nextFloat(state);
  return [min + Math.floor(f * (max - min + 1)), s];
}
