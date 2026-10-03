import { describe, expect, it } from "vitest";
import { advanceTime, createLife, damageLifespan, DAYS_PER_YEAR, remainingDays } from "./life";
import { newGame, reincarnate } from "./game";

describe("life", () => {
  it("advances age by the time spent", () => {
    const life = createLife(1);
    const { life: after, spentDays } = advanceTime(life, DAYS_PER_YEAR);
    expect(spentDays).toBe(DAYS_PER_YEAR);
    expect(after.ageDays).toBe(life.ageDays + DAYS_PER_YEAR);
    expect(after.alive).toBe(true);
  });

  it("stops at death and spends only the remaining lifespan", () => {
    const life = createLife(1);
    const { life: after, spentDays } = advanceTime(life, 1000 * DAYS_PER_YEAR);
    expect(spentDays).toBe(remainingDays(life));
    expect(after.alive).toBe(false);
    expect(advanceTime(after, 10).spentDays).toBe(0);
  });

  it("lifespan damage can kill an old cultivator outright", () => {
    const old = advanceTime(createLife(1), 50 * DAYS_PER_YEAR).life;
    expect(damageLifespan(old, 30 * DAYS_PER_YEAR).alive).toBe(false);
  });

  it("reincarnation keeps nothing of the body but counts the incarnation", () => {
    const g = newGame(1);
    const dead = { ...g, life: advanceTime(g.life, 1e9).life };
    const next = reincarnate(dead, 2);
    expect(next.life).toEqual({ ...createLife(2) });
    expect(next.realmSeed).toBe(2);
  });
});
