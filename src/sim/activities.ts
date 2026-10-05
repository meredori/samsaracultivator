// Timed activities. Each one runs continuously and costs in-world time; rates
// are per month so they read the way the player sees them. All numbers are
// provisional placeholders for the opening.

import { heal, injure, type Body } from "./body";

export const DAYS_PER_MONTH = 30;

export type Activity = "idle" | "rest" | "train" | "explore";

export const REST_HEALTH_PER_MONTH = 5;
export const TRAIN_BAREHAND_PER_MONTH = 10;
export const TRAIN_HEALTH_COST_PER_MONTH = 1;

/** Whether the body can start or keep doing an activity. */
export function canDo(body: Body, activity: Activity): boolean {
  return activity !== "train" || body.health > 0;
}

/**
 * How many of `days` the activity can run before it must stop, e.g. training
 * stops when health runs out. Whole days only; the last one may overdraw health,
 * which bottoms out at zero.
 */
export function daysAvailable(body: Body, activity: Activity, days: number): number {
  if (activity !== "train") return days;
  return Math.min(days, Math.ceil((body.health / TRAIN_HEALTH_COST_PER_MONTH) * DAYS_PER_MONTH));
}

/** Applies `days` of the activity's effects to the body. Exploring has no effect yet. */
export function applyActivity(body: Body, activity: Activity, days: number): Body {
  const months = days / DAYS_PER_MONTH;
  switch (activity) {
    case "rest":
      return heal(body, REST_HEALTH_PER_MONTH * months);
    case "train": {
      const hurt = injure(body, TRAIN_HEALTH_COST_PER_MONTH * months);
      const barehand = body.proficiencies.barehand + TRAIN_BAREHAND_PER_MONTH * months;
      return { ...hurt, proficiencies: { ...hurt.proficiencies, barehand } };
    }
    default:
      return body;
  }
}
