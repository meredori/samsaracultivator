import { z } from "zod";
import type { GameState } from "../sim";

const u32 = z.number().int().min(0).max(0xffffffff);

export const LifeSchema = z.object({
  incarnation: z.number().int().positive(),
  ageDays: z.number().int().nonnegative(),
  lifespanDays: z.number().int().nonnegative(),
  alive: z.boolean(),
  body: z.object({
    health: z.number().nonnegative(),
    maxHealth: z.number().positive(),
    proficiencies: z.object({
      barehand: z.object({ level: z.number().int().nonnegative(), progress: z.number().nonnegative() }),
    }),
  }),
});

export const GameStateSchema = z.object({
  version: z.literal(1),
  life: LifeSchema,
  activity: z.enum(["idle", "rest", "train", "explore"]),
  revealed: z.array(z.enum(["character"])),
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
