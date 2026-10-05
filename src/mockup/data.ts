// Static placeholder data for the UI mockup. Nothing here is a balanced or
// final number; it mirrors the concept screen so the layout can be judged.

import type { SceneKind, SpriteKey } from "../render/sprites";

export { spriteUrl, type SceneKind, type SpriteKey } from "../render/sprites";

export type ActionId = "cultivate" | "explore" | "train" | "refine" | "recover" | "contemplate";

export interface ActionDef {
  id: ActionId;
  name: string;
  verb: string;
  blurb: string;
  sprite: SpriteKey;
  scene: SceneKind;
  /** in-game years one full cycle of the action costs */
  years: number;
}

export const ACTIONS: ActionDef[] = [
  {
    id: "cultivate",
    name: "Cultivate",
    verb: "Cultivating",
    blurb: "Advance your current realm. Consumes time.",
    sprite: "meditate",
    scene: "courtyard",
    years: 2,
  },
  {
    id: "explore",
    name: "Explore",
    verb: "Exploring",
    blurb: "Search for resources, opportunities, and secrets.",
    sprite: "explore",
    scene: "trail",
    years: 1,
  },
  {
    id: "train",
    name: "Train Body",
    verb: "Training",
    blurb: "Strengthen physical form. Gain stats and reduce impurity.",
    sprite: "train",
    scene: "training",
    years: 1,
  },
  {
    id: "refine",
    name: "Refine Resources",
    verb: "Refining",
    blurb: "Refine herbs, bones, and ores into cultivation materials.",
    sprite: "idle",
    scene: "camp",
    years: 1,
  },
  {
    id: "recover",
    name: "Recover",
    verb: "Recovering",
    blurb: "Rest and heal. Reduce injury and impurity.",
    sprite: "meditate",
    scene: "camp",
    years: 1,
  },
  {
    id: "contemplate",
    name: "Contemplate",
    verb: "Contemplating",
    blurb: "Gain insight. Small chance for breakthrough.",
    sprite: "contemplate",
    scene: "courtyard",
    years: 1,
  },
];

export const ACTION_DETAIL: Record<ActionId, string> = {
  cultivate: "Refine your flesh and bones into a stronger foundation.",
  explore: "Wander the Lower Realm in search of what fate has hidden.",
  train: "Strike the wooden post until your bones ring like iron.",
  refine: "Grind, steep and render raw materials into essence.",
  recover: "Rest by the fire and let the body mend itself.",
  contemplate: "Turn the scroll over in your mind until it opens.",
};

export interface NavItem {
  id: string;
  label: string;
  /** hidden in the first life (progressive disclosure) */
  locked?: boolean;
}

export const NAV: NavItem[] = [
  { id: "character", label: "Character" },
  { id: "cultivation", label: "Cultivation" },
  { id: "explore", label: "Explore" },
  { id: "techniques", label: "Techniques", locked: true },
  { id: "samsara", label: "Samsara", locked: true },
  { id: "inventory", label: "Inventory" },
  { id: "sect", label: "Sect", locked: true },
];

export const STAGES = [
  "Skin",
  "Flesh",
  "Bone",
  "Organs",
  "Marrow",
  "Meridian",
  "Physique",
  "True Body",
  "Nirvana Form",
];

export type OpportunityTone = "explore" | "join" | "claim" | "attack" | "prepare";

export interface Opportunity {
  id: string;
  name: string;
  blurb: string;
  action: string;
  tone: OpportunityTone;
  tag: string;
  /** palette used for the placeholder thumbnail */
  thumb: [string, string];
}

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "battlefield",
    name: "Ancient Battlefield",
    blurb: "Traces of old heroes linger. May hold surviving inheritances.",
    action: "Explore",
    tone: "explore",
    tag: "High Risk · High Reward",
    thumb: ["#c9b9a0", "#5d5348"],
  },
  {
    id: "black-river",
    name: "Black River Sect",
    blurb: "A rising demonic sect seeks new disciples.",
    action: "Join",
    tone: "join",
    tag: "Allies · Life Path",
    thumb: ["#7d8d99", "#3a2a2e"],
  },
  {
    id: "grotto",
    name: "Pure Qi Grotto",
    blurb: "A natural grotto filled with exceptionally pure qi.",
    action: "Claim",
    tone: "claim",
    tag: "One-time Opportunity",
    thumb: ["#7fd3e6", "#123a55"],
  },
  {
    id: "wolf-den",
    name: "Spirit Wolf Den",
    blurb: "A pack of spirit wolves roam this region.",
    action: "Attack",
    tone: "attack",
    tag: "Moderate Risk",
    thumb: ["#a9b7c4", "#2b3440"],
  },
  {
    id: "mystic-realm",
    name: "Mystic Realm",
    blurb: "A mysterious realm will appear in 6 years...",
    action: "Prepare",
    tone: "prepare",
    tag: "Limited Time",
    thumb: ["#b9c6dd", "#3d4a6b"],
  },
];

export interface Resource {
  id: string;
  name: string;
  amount: number;
  icon: "wood" | "marrow" | "herb" | "powder" | "fire" | "stone";
}

export const RESOURCES: Resource[] = [
  { id: "ironwood", name: "Ironwood", amount: 24, icon: "wood" },
  { id: "beast-marrow", name: "Beast Marrow", amount: 12, icon: "marrow" },
  { id: "spirit-herbs", name: "Spirit Herbs", amount: 36, icon: "herb" },
  { id: "bone-powder", name: "Bone Powder", amount: 8, icon: "powder" },
  { id: "fire-essence", name: "Fire Essence", amount: 6, icon: "fire" },
  { id: "spirit-stone", name: "Spirit Stone", amount: 3, icon: "stone" },
];

export const LOCATIONS = [
  { id: "village", name: "Qingshi Village", note: "Birthplace" },
  { id: "pine-courtyard", name: "Pine Courtyard", note: "Cultivation spot" },
];

export const SEASONS = ["Spring", "Summer", "Autumn", "Winter"] as const;
