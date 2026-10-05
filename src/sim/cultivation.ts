// Qi cultivation: qi gathered while cultivating fills the current stage, and a
// full stage advances to the next. Nine stages make a realm. All numbers are
// provisional placeholders for the first playable.

export const REALM_NAMES = [
  "Mortal",
  "Spirit",
  "Earth",
  "Heaven",
  "Profound",
  "Dao",
  "Celestial",
  "Divine",
  "Primordial",
] as const;

export const STAGES_PER_REALM = 9;

/** Qi gathered per in-world day spent cultivating. */
export const QI_PER_DAY = 1;

/** Qi needed to clear the first stage of the Mortal realm. */
export const BASE_STAGE_QI = 60;

/** Each stage needs this many times the qi of the one before it. */
export const STAGE_QI_GROWTH = 1.25;

export interface Cultivation {
  /** Index into REALM_NAMES. */
  realm: number;
  /** 1 to STAGES_PER_REALM. */
  stage: number;
  /** Qi gathered toward clearing the current stage. */
  qi: number;
}

export function createCultivation(): Cultivation {
  return { realm: 0, stage: 1, qi: 0 };
}

export function qiForStage(c: Pick<Cultivation, "realm" | "stage">): number {
  const index = c.realm * STAGES_PER_REALM + (c.stage - 1);
  return Math.round(BASE_STAGE_QI * STAGE_QI_GROWTH ** index);
}

export function isPeak(c: Cultivation): boolean {
  return c.realm === REALM_NAMES.length - 1 && c.stage === STAGES_PER_REALM;
}

/** Adds qi, clearing as many stages as it fills. Qi stops at the cap of the final stage. */
export function gatherQi(c: Cultivation, amount: number): Cultivation {
  let { realm, stage, qi } = c;
  qi += Math.max(0, amount);
  for (;;) {
    const need = qiForStage({ realm, stage });
    if (qi < need) break;
    if (isPeak({ realm, stage, qi })) {
      qi = need;
      break;
    }
    qi -= need;
    if (stage < STAGES_PER_REALM) stage++;
    else {
      realm++;
      stage = 1;
    }
  }
  return { realm, stage, qi };
}
