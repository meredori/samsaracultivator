import { z } from "zod";
import { REALM_NAMES, STAGES_PER_REALM, type GameState } from "../sim";

const u32 = z.number().int().min(0).max(0xffffffff);

export const LifeSchema = z.object({
  incarnation: z.number().int().positive(),
  ageDays: z.number().int().nonnegative(),
  lifespanDays: z.number().int().nonnegative(),
  alive: z.boolean(),
  cultivation: z.object({
    realm: z.number().int().min(0).max(REALM_NAMES.length - 1),
    stage: z.number().int().min(1).max(STAGES_PER_REALM),
    qi: z.number().nonnegative(),
  }),
});

export const GameStateSchema = z.object({
  version: z.literal(1),
  life: LifeSchema,
  activity: z.enum(["idle", "cultivate"]),
  realmSeed: u32,
  rng: z.tuple([u32, u32, u32, u32]),
});

// Fails to compile if the schema drifts from the simulation's GameState.
type Exact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never;
const _schemaMatchesSim: Exact<z.infer<typeof GameStateSchema>, GameState> = true;
void _schemaMatchesSim;

export function serialize(state: GameState): string {
  return JSON.stringify(state);
}

export function deserialize(json: string): GameState {
  return GameStateSchema.parse(JSON.parse(json));
}
