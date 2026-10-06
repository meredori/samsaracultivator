// Progressive reveal: the UI shows only systems the player has discovered.
// A feature, once revealed, stays revealed across incarnations, since the
// player remembers it.

import type { Life } from "./life";

export type Feature = "character";

/** Each feature and the moment it is discovered. */
const DISCOVERED: Record<Feature, (life: Life) => boolean> = {
  // the first proficiency level opens the Character tab
  character: (life) => life.body.proficiencies.barehand.level >= 1,
};

export function discover(revealed: readonly Feature[], life: Life): Feature[] {
  const found = (Object.keys(DISCOVERED) as Feature[]).filter((f) => !revealed.includes(f) && DISCOVERED[f](life));
  return found.length ? [...revealed, ...found] : (revealed as Feature[]);
}
