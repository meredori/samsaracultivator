// One incarnation's finite pool of time. In-world time only advances while an
// action runs, so every action goes through advanceTime.

import { createBody, type Body } from "./body";

export const DAYS_PER_YEAR = 360;

export interface Life {
  incarnation: number;
  ageDays: number;
  /** Maximum lifespan; lifespan damage lowers this rather than adding age. */
  lifespanDays: number;
  alive: boolean;
  body: Body;
}

export function createLife(incarnation: number): Life {
  return {
    incarnation,
    ageDays: 16 * DAYS_PER_YEAR,
    lifespanDays: 70 * DAYS_PER_YEAR,
    alive: true,
    body: createBody(),
  };
}

/** Spends up to `days` of the life; stops at death. Returns the days actually spent. */
export function advanceTime(life: Life, days: number): { life: Life; spentDays: number } {
  if (!life.alive || days <= 0) return { life, spentDays: 0 };
  const spentDays = Math.min(days, remainingDays(life));
  const ageDays = life.ageDays + spentDays;
  return { life: { ...life, ageDays, alive: ageDays < life.lifespanDays }, spentDays };
}

export function damageLifespan(life: Life, days: number): Life {
  const lifespanDays = Math.max(0, life.lifespanDays - days);
  return { ...life, lifespanDays, alive: life.alive && life.ageDays < lifespanDays };
}

export function remainingDays(life: Life): number {
  return Math.max(0, life.lifespanDays - life.ageDays);
}
