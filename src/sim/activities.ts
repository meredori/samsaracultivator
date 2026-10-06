// Timed activities. Each one runs in one-month cycles of in-world time and pays
// out its effects in one go when a cycle completes. All numbers are
// provisional placeholders for the opening.

import { heal, injure, type Body } from "./body";
import { gainProgress } from "./proficiency";

export const DAYS_PER_MONTH = 30;

export type Activity = "idle" | "rest" | "train" | "explore";

export const REST_HEALTH_PER_MONTH = 5;
/** Barehand progress (not levels) per month of training against the starter tree. */
export const TRAIN_BAREHAND_PER_MONTH = 10;
export const TRAIN_HEALTH_COST_PER_MONTH = 1;

/** Whether the body can start or keep doing an activity. */
export function canDo(body: Body, activity: Activity): boolean {
  return activity !== "train" || body.health > 0;
}

/** Applies one completed month of the activity's effects to the body. Exploring has no effect yet. */
export function completeMonth(body: Body, activity: Activity): Body {
  switch (activity) {
    case "rest":
      return heal(body, REST_HEALTH_PER_MONTH);
    case "train": {
      const hurt = injure(body, TRAIN_HEALTH_COST_PER_MONTH);
      const barehand = gainProgress(body.proficiencies.barehand, TRAIN_BAREHAND_PER_MONTH);
      return { ...hurt, proficiencies: { ...hurt.proficiencies, barehand } };
    }
    default:
      return body;
  }
}
