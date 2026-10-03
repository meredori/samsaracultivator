import { createLife, type Life } from "./life";
import { seedRng, type RngState } from "./rng";

export interface GameState {
  version: 1;
  life: Life;
  /** Seed of the current incarnation's Lower Realm. */
  realmSeed: number;
  rng: RngState;
}

export function newGame(seed: number): GameState {
  return { version: 1, life: createLife(1), realmSeed: seed, rng: seedRng(seed) };
}

/** Starts the next incarnation in a fresh Lower Realm. Body and inventory do not carry over. */
export function reincarnate(state: GameState, nextSeed: number): GameState {
  return {
    ...state,
    life: createLife(state.life.incarnation + 1),
    realmSeed: nextSeed,
    rng: seedRng(nextSeed),
  };
}
