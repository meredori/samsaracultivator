import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { advanceTime, DAYS_PER_YEAR, newGame, reincarnate, type GameState } from "../sim";

interface GameStore {
  game: GameState;
  /** Placeholder action until real Body/Explore actions exist. */
  passYears: (years: number) => void;
  reincarnate: () => void;
}

const randomSeed = () => (Math.random() * 0x100000000) >>> 0;

export const useGameStore = create<GameStore>()(
  immer((set) => ({
    game: newGame(randomSeed()),
    passYears: (years) =>
      set((s) => {
        s.game.life = advanceTime(s.game.life, years * DAYS_PER_YEAR).life;
      }),
    reincarnate: () =>
      set((s) => {
        s.game = reincarnate(s.game, randomSeed());
      }),
  })),
);
