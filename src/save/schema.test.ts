import { describe, expect, it } from "vitest";
import { advanceTime, newGame } from "../sim";
import { deserialize, serialize } from "./schema";

describe("save", () => {
  it("round-trips a game", () => {
    const g = newGame(123);
    const state = { ...g, life: advanceTime(g.life, 400).life };
    expect(deserialize(serialize(state))).toEqual(state);
  });

  it("rejects a corrupt save", () => {
    const bad = JSON.stringify({ ...newGame(1), life: { incarnation: 0 } });
    expect(() => deserialize(bad)).toThrow();
  });
});
