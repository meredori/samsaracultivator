import type { LucideIcon } from "lucide-react";

/** Colour families used across badges, bars, emblems and buttons. */
export type Tone = "navy" | "jade" | "blue" | "gold" | "red" | "purple" | "grey";

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic";

export const RARITIES: readonly Rarity[] = ["common", "uncommon", "rare", "epic", "legendary", "mythic"];

export const RARITY_LABEL: Record<Rarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  mythic: "Mythic",
};

/** Cultivation realms, lowest first. */
export type Realm =
  | "mortal"
  | "spirit"
  | "earth"
  | "heaven"
  | "profound"
  | "dao"
  | "celestial"
  | "divine"
  | "primordial";

export const REALMS: readonly Realm[] = [
  "mortal",
  "spirit",
  "earth",
  "heaven",
  "profound",
  "dao",
  "celestial",
  "divine",
  "primordial",
];

export const REALM_LABEL: Record<Realm, string> = {
  mortal: "Mortal",
  spirit: "Spirit",
  earth: "Earth",
  heaven: "Heaven",
  profound: "Profound",
  dao: "Dao",
  celestial: "Celestial",
  divine: "Divine",
  primordial: "Primordial",
};

export type Risk = "low" | "medium" | "high";

export const RISK_TONE: Record<Risk, Tone> = { low: "jade", medium: "gold", high: "red" };

export const RISK_LABEL: Record<Risk, string> = { low: "Low", medium: "Medium", high: "High" };

/** An inventory item as the item components display it. */
export interface ItemData {
  id: string;
  name: string;
  icon: LucideIcon;
  rarity: Rarity;
  /** e.g. Material, Catalyst, Manual, Equipment */
  category: string;
  count?: number;
  description?: string;
  source?: string;
  use?: string;
}

export type Icon = LucideIcon;

/** Joins class names, skipping falsy values. */
export function cx(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(" ");
}

export function clampPct(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, (value / max) * 100));
}
