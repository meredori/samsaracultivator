import { gatherQi, QI_PER_DAY } from "./cultivation";
import { advanceTime, createLife, type Life } from "./life";
import { seedRng, type RngState } from "./rng";

/** What the character is doing. In-world time only passes while this is not idle. */
export type Activity = "idle" | "cultivate";

export interface GameState {
  version: 1;
  life: Life;
  activity: Activity;
  /** Seed of the current incarnation's Lower Realm. */
  realmSeed: number;
  rng: RngState;
}

export function newGame(seed: number): GameState {
  return { version: 1, life: createLife(1), activity: "idle", realmSeed: seed, rng: seedRng(seed) };
}

export function setActivity(state: GameState, activity: Activity): GameState {
  if (!state.life.alive) return state;
  return { ...state, activity };
}

/** Runs the current activity for up to `days` of in-world time. Idle spends nothing. */
export function spendDays(state: GameState, days: number): GameState {
  if (state.activity === "idle") return state;
  const { life, spentDays } = advanceTime(state.life, days);
  const cultivation = gatherQi(life.cultivation, spentDays * QI_PER_DAY);
  return {
    ...state,
    life: { ...life, cultivation },
    activity: life.alive ? state.activity : "idle",
  };
}

/** Starts the next incarnation in a fresh Lower Realm. Body and inventory do not carry over. */
export function reincarnate(state: GameState, nextSeed: number): GameState {
  return {
    ...state,
    life: createLife(state.life.incarnation + 1),
    activity: "idle",
    realmSeed: nextSeed,
    rng: seedRng(nextSeed),
  };
}
