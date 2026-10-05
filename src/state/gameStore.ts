import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { newGame, reincarnate, setActivity, spendDays, type Activity, type GameState } from "../sim";

/** In-world days that pass per real second while an activity runs (a month every 5 seconds). */
export const DAYS_PER_SECOND = 6;

interface GameStore {
  game: GameState;
  /** Fraction of a day of real time not yet spent; the sim only spends whole days. */
  dayCarry: number;
  /** Starts an activity, or stops it (back to idle) if it is already running. */
  toggleActivity: (activity: Exclude<Activity, "idle">) => void;
  /** Advances the game by `seconds` of real time. */
  tick: (seconds: number) => void;
  reincarnate: () => void;
}

const randomSeed = () => (Math.random() * 0x100000000) >>> 0;

export const useGameStore = create<GameStore>()(
  immer((set) => ({
    game: newGame(randomSeed()),
    dayCarry: 0,
    toggleActivity: (activity) =>
      set((s) => {
        s.game = setActivity(s.game, s.game.activity === activity ? "idle" : activity);
      }),
    tick: (seconds) =>
      set((s) => {
        if (s.game.activity === "idle") return;
        const days = s.dayCarry + seconds * DAYS_PER_SECOND;
        const whole = Math.floor(days);
        s.dayCarry = days - whole;
        if (whole > 0) s.game = spendDays(s.game, whole);
      }),
    reincarnate: () =>
      set((s) => {
        s.game = reincarnate(s.game, randomSeed());
        s.dayCarry = 0;
      }),
  })),
);
