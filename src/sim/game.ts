import { applyActivity, canDo, daysAvailable, type Activity } from "./activities";
import { advanceTime, createLife, type Life } from "./life";
import { discover, type Feature } from "./reveal";
import { seedRng, type RngState } from "./rng";

export interface GameState {
  version: 1;
  life: Life;
  /** What the character is doing. In-world time only passes while this is not idle. */
  activity: Activity;
  /** Features the player has discovered; the UI shows nothing else. */
  revealed: Feature[];
  /** Seed of the current incarnation's Lower Realm. */
  realmSeed: number;
  rng: RngState;
}

export function newGame(seed: number): GameState {
  return { version: 1, life: createLife(1), activity: "idle", revealed: [], realmSeed: seed, rng: seedRng(seed) };
}

export function setActivity(state: GameState, activity: Activity): GameState {
  if (!state.life.alive || !canDo(state.life.body, activity)) return state;
  return { ...state, activity };
}

/** Runs the current activity for up to `days` of in-world time. Idle spends nothing. */
export function spendDays(state: GameState, days: number): GameState {
  const { activity } = state;
  if (activity === "idle") return state;
  const { life, spentDays } = advanceTime(state.life, daysAvailable(state.life.body, activity, days));
  const next = { ...life, body: applyActivity(life.body, activity, spentDays) };
  return {
    ...state,
    life: next,
    activity: next.alive && canDo(next.body, activity) ? activity : "idle",
    revealed: discover(state.revealed, next),
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
