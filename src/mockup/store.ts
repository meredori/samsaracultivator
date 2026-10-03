import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { ACTIONS, type ActionId } from "./data";

// A throwaway store that makes the mockup feel alive. It is NOT the game
// simulation: time only moves while an action runs (a design law), and the
// numbers just nudge the UI so the layout can be seen in motion.

/** in-game years that pass per real second while an action runs */
const YEARS_PER_SECOND = 0.1;

export interface MockState {
  action: ActionId;
  running: boolean;
  age: number;
  lifespan: number;
  stage: number; // 1-based index into STAGES
  stageProgress: number; // 0..1
  impurity: number; // 0..1
  bonePowder: number;
  beastMarrow: number;
  nav: string;
  resourceTab: "resources" | "locations";
  setAction: (id: ActionId) => void;
  toggleRunning: () => void;
  setNav: (id: string) => void;
  setResourceTab: (tab: MockState["resourceTab"]) => void;
  tick: (dtSeconds: number) => void;
}

export const useMock = create<MockState>()(
  immer((set) => ({
    action: "cultivate",
    running: true,
    age: 18,
    lifespan: 73,
    stage: 3,
    stageProgress: 0.28,
    impurity: 0.16,
    bonePowder: 12,
    beastMarrow: 5,
    nav: "character",
    resourceTab: "resources",
    setAction: (id) =>
      set((s) => {
        s.action = id;
        s.running = true;
      }),
    toggleRunning: () =>
      set((s) => {
        s.running = !s.running;
      }),
    setNav: (id) =>
      set((s) => {
        s.nav = id;
      }),
    setResourceTab: (tab) =>
      set((s) => {
        s.resourceTab = tab;
      }),
    tick: (dt) =>
      set((s) => {
        if (!s.running || s.age >= s.lifespan) return;
        const years = dt * YEARS_PER_SECOND;
        s.age = Math.min(s.lifespan, s.age + years);
        const def = ACTIONS.find((a) => a.id === s.action)!;
        switch (s.action) {
          case "cultivate":
            s.stageProgress += years / def.years / 4;
            break;
          case "train":
            s.stageProgress += years / def.years / 10;
            s.impurity = Math.max(0, s.impurity - years * 0.01);
            break;
          case "recover":
            s.impurity = Math.max(0, s.impurity - years * 0.03);
            break;
          case "contemplate":
            s.stageProgress += years / def.years / 16;
            break;
          case "explore":
            s.beastMarrow = Math.min(10, s.beastMarrow + years * 0.5);
            break;
          case "refine":
            s.bonePowder = Math.min(30, s.bonePowder + years * 2);
            break;
        }
        if (s.stageProgress >= 1) {
          s.stageProgress = 0;
          s.stage = Math.min(9, s.stage + 1);
        }
      }),
  })),
);
