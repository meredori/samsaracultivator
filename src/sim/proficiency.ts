// Proficiencies level up from progress. Each level needs more progress than
// the last on a gentle exponential curve, so early levels come from primitive
// training while later ones expect better methods, teachers or multipliers.

export const BASE_LEVEL_PROGRESS = 100;
export const LEVEL_PROGRESS_GROWTH = 1.35;

export interface Proficiency {
  level: number;
  /** Progress toward the next level; may be fractional. */
  progress: number;
}

export function createProficiency(): Proficiency {
  return { level: 0, progress: 0 };
}

/** Progress needed to go from `level` to the next, rounded to the nearest 10. */
export function progressToNextLevel(level: number): number {
  return Math.round((BASE_LEVEL_PROGRESS * LEVEL_PROGRESS_GROWTH ** level) / 10) * 10;
}

/** Adds progress, gaining as many levels as it fills; leftover carries into the next level. */
export function gainProgress(p: Proficiency, amount: number): Proficiency {
  let { level, progress } = p;
  progress += Math.max(0, amount);
  while (progress >= progressToNextLevel(level)) {
    progress -= progressToNextLevel(level);
    level++;
  }
  return { level, progress };
}
