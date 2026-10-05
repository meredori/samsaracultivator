// The physical body: health and the mundane skills trained into it. Both belong
// to one incarnation and are lost with it.

export const STARTING_HEALTH = 30;

export interface Proficiencies {
  barehand: number;
}

export interface Body {
  /** May be fractional; activities change it a little each day. */
  health: number;
  maxHealth: number;
  proficiencies: Proficiencies;
}

export function createBody(): Body {
  return { health: STARTING_HEALTH, maxHealth: STARTING_HEALTH, proficiencies: { barehand: 0 } };
}

export function heal(body: Body, amount: number): Body {
  return { ...body, health: Math.min(body.maxHealth, body.health + amount) };
}

export function injure(body: Body, amount: number): Body {
  return { ...body, health: Math.max(0, body.health - amount) };
}
