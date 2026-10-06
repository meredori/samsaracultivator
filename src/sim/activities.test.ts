import { describe, expect, it } from "vitest";
import { DAYS_PER_MONTH } from "./activities";
import { createBody, STARTING_HEALTH } from "./body";
import { newGame, reincarnate, setActivity, spendDays, type GameState } from "./game";
import { DAYS_PER_YEAR } from "./life";

const MONTH = DAYS_PER_MONTH;
const doing = (activity: GameState["activity"], g = newGame(1)) => setActivity(g, activity);

describe("opening state", () => {
  it("starts idle at full health with nothing discovered", () => {
    const g = newGame(1);
    expect(g.activity).toBe("idle");
    expect(g.life.body).toEqual({ health: 30, maxHealth: 30, proficiencies: { barehand: { level: 0, progress: 0 } } });
    expect(g.revealed).toEqual([]);
  });

  it("passes no time while idle", () => {
    const g = newGame(1);
    expect(spendDays(g, 100)).toBe(g);
  });
});

describe("train", () => {
  it("grants barehand progress, not levels, and costs health each month", () => {
    const g = spendDays(doing("train"), MONTH);
    expect(g.life.ageDays).toBe(newGame(1).life.ageDays + MONTH);
    expect(g.life.body.proficiencies.barehand.level).toBe(0);
    expect(g.life.body.proficiencies.barehand.progress).toBeCloseTo(10);
    expect(g.life.body.health).toBeCloseTo(STARTING_HEALTH - 1);
  });

  it("pays out only when a month completes", () => {
    const partial = spendDays(doing("train"), MONTH - 1);
    expect(partial.cycleDays).toBe(MONTH - 1);
    expect(partial.life.body).toEqual(createBody());
    const done = spendDays(partial, 1);
    expect(done.cycleDays).toBe(0);
    expect(done.life.body.proficiencies.barehand.progress).toBe(10);
    expect(done.life.body.health).toBe(STARTING_HEALTH - 1);
  });

  it("abandons the partial month when stopped", () => {
    const partial = spendDays(doing("train"), MONTH - 1);
    const restarted = setActivity(setActivity(partial, "idle"), "train");
    expect(restarted.cycleDays).toBe(0);
    expect(spendDays(restarted, 1).life.body).toEqual(createBody());
  });

  it("stops when health runs out, spending only the days it could train", () => {
    const g = spendDays(doing("train"), 1000 * MONTH);
    expect(g.life.body.health).toBe(0);
    expect(g.activity).toBe("idle");
    expect(g.life.ageDays).toBe(newGame(1).life.ageDays + STARTING_HEALTH * MONTH);
    expect(setActivity(g, "train").activity).toBe("idle");
  });

  it("reveals the Character tab at the first proficiency level, after ten months", () => {
    const early = spendDays(doing("train"), 10 * MONTH - 1);
    expect(early.revealed).toEqual([]);
    const g = spendDays(early, 1);
    expect(g.life.body.proficiencies.barehand.level).toBe(1);
    expect(g.revealed).toEqual(["character"]);
    expect(spendDays(g, MONTH).revealed).toEqual(["character"]);
  });
});

describe("rest", () => {
  it("heals each month up to the maximum", () => {
    const hurt = spendDays(doing("train"), 10 * MONTH);
    const g = spendDays(setActivity(hurt, "rest"), MONTH);
    expect(g.life.body.health).toBeCloseTo(hurt.life.body.health + 5);
    expect(spendDays(g, 100 * MONTH).life.body.health).toBe(STARTING_HEALTH);
  });
});

describe("explore", () => {
  it("only passes time for now", () => {
    const g = spendDays(doing("explore"), MONTH);
    expect(g.life.ageDays).toBe(newGame(1).life.ageDays + MONTH);
    expect(g.life.body).toEqual(createBody());
  });
});

describe("death", () => {
  it("stops every activity and keeps discoveries through reincarnation", () => {
    const trained = spendDays(doing("train"), 10 * MONTH);
    const dead = spendDays(setActivity(trained, "explore"), 1000 * DAYS_PER_YEAR);
    expect(dead.life.alive).toBe(false);
    expect(dead.activity).toBe("idle");
    expect(setActivity(dead, "rest").activity).toBe("idle");
    const next = reincarnate(dead, 2);
    expect(next.life.body).toEqual(createBody());
    expect(next.revealed).toEqual(["character"]);
  });
});
