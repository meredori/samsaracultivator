import { canDo, completeMonth, DAYS_PER_MONTH, type Activity } from "./activities";
import { advanceTime, createLife, type Life } from "./life";
import { discover, type Feature } from "./reveal";
import { seedRng, type RngState } from "./rng";

export interface GameState {
  version: 1;
  life: Life;
  /** What the character is doing. In-world time only passes while this is not idle. */
  activity: Activity;
  /** Whole days into the running activity's current one-month cycle; effects land when it completes. */
  cycleDays: number;
  /** Features the player has discovered; the UI shows nothing else. */
  revealed: Feature[];
  /** Seed of the current incarnation's Lower Realm. */
  realmSeed: number;
  rng: RngState;
}

export function newGame(seed: number): GameState {
  return { version: 1, life: createLife(1), activity: "idle", cycleDays: 0, revealed: [], realmSeed: seed, rng: seedRng(seed) };
}

export function setActivity(state: GameState, activity: Activity): GameState {
  if (!state.life.alive || !canDo(state.life.body, activity)) return state;
  // switching or stopping abandons the partial cycle
  return { ...state, activity, cycleDays: activity === state.activity ? state.cycleDays : 0 };
}

/**
 * Runs the current activity for up to `days` of in-world time, applying its
 * effects at the end of each completed month. Idle spends nothing.
 */
export function spendDays(state: GameState, days: number): GameState {
  const { activity } = state;
  if (activity === "idle") return state;
  let { life, cycleDays } = state;
  let left = days;
  while (left > 0 && life.alive && canDo(life.body, activity)) {
    const advanced = advanceTime(life, Math.min(left, DAYS_PER_MONTH - cycleDays));
    if (advanced.spentDays === 0) break;
    life = advanced.life;
    left -= advanced.spentDays;
    cycleDays += advanced.spentDays;
    if (cycleDays === DAYS_PER_MONTH) {
      cycleDays = 0;
      if (life.alive) life = { ...life, body: completeMonth(life.body, activity) };
    }
  }
  const running = life.alive && canDo(life.body, activity);
  return {
    ...state,
    life,
    activity: running ? activity : "idle",
    cycleDays: running ? cycleDays : 0,
    revealed: discover(state.revealed, life),
  };
}

/** Starts the next incarnation in a fresh Lower Realm. Body and inventory do not carry over. */
export function reincarnate(state: GameState, nextSeed: number): GameState {
  return {
    ...state,
    life: createLife(state.life.incarnation + 1),
    activity: "idle",
    cycleDays: 0,
    realmSeed: nextSeed,
    rng: seedRng(nextSeed),
  };
}
