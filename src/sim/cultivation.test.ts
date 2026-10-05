import { describe, expect, it } from "vitest";
import {
  createCultivation,
  gatherQi,
  qiForStage,
  REALM_NAMES,
  STAGES_PER_REALM,
  type Cultivation,
} from "./cultivation";
import { newGame, reincarnate, setActivity, spendDays } from "./game";
import { DAYS_PER_YEAR } from "./life";

describe("cultivation", () => {
  it("fills the current stage without advancing until it is full", () => {
    const c = gatherQi(createCultivation(), qiForStage(createCultivation()) - 1);
    expect(c).toEqual({ realm: 0, stage: 1, qi: qiForStage(c) - 1 });
  });

  it("carries leftover qi into the next stage", () => {
    const first = qiForStage(createCultivation());
    expect(gatherQi(createCultivation(), first + 5)).toEqual({ realm: 0, stage: 2, qi: 5 });
  });

  it("each stage needs more qi than the last", () => {
    expect(qiForStage({ realm: 0, stage: 2 })).toBeGreaterThan(qiForStage({ realm: 0, stage: 1 }));
    expect(qiForStage({ realm: 1, stage: 1 })).toBeGreaterThan(qiForStage({ realm: 0, stage: STAGES_PER_REALM }));
  });

  it("breaks through to the next realm after the final stage", () => {
    const top: Cultivation = { realm: 0, stage: STAGES_PER_REALM, qi: 0 };
    expect(gatherQi(top, qiForStage(top))).toEqual({ realm: 1, stage: 1, qi: 0 });
  });

  it("stops at the peak of the last realm", () => {
    const peak: Cultivation = { realm: REALM_NAMES.length - 1, stage: STAGES_PER_REALM, qi: 0 };
    expect(gatherQi(peak, 1e12)).toEqual({ ...peak, qi: qiForStage(peak) });
  });
});

describe("cultivate activity", () => {
  it("passes no time while idle", () => {
    const g = newGame(1);
    expect(spendDays(g, 100)).toBe(g);
  });

  it("ages the body and gathers qi while cultivating", () => {
    const g = spendDays(setActivity(newGame(1), "cultivate"), 30);
    expect(g.life.ageDays).toBe(newGame(1).life.ageDays + 30);
    expect(g.life.cultivation.qi).toBe(30);
  });

  it("stops cultivating at death and gathers only the days lived", () => {
    const g = spendDays(setActivity(newGame(1), "cultivate"), 1000 * DAYS_PER_YEAR);
    expect(g.life.alive).toBe(false);
    expect(g.activity).toBe("idle");
    expect(setActivity(g, "cultivate").activity).toBe("idle");
  });

  it("loses cultivation on reincarnation", () => {
    const g = spendDays(setActivity(newGame(1), "cultivate"), 1000 * DAYS_PER_YEAR);
    expect(reincarnate(g, 2).life.cultivation).toEqual(createCultivation());
  });
});
