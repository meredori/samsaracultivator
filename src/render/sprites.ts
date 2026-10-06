import combat from "../assets/sprites/combat.png";
import contemplate from "../assets/sprites/contemplate.png";
import explore from "../assets/sprites/explore.png";
import idle from "../assets/sprites/idle.png";
import meditate from "../assets/sprites/meditate.png";
import train from "../assets/sprites/train.png";

export type SpriteKey = "idle" | "meditate" | "explore" | "train" | "contemplate" | "combat";

const SPRITES: Record<SpriteKey, string> = { idle, meditate, explore, train, contemplate, combat };

export const spriteUrl = (key: SpriteKey) => SPRITES[key];

/** Backdrops the activity window can draw. */
export type SceneKind = "courtyard" | "trail" | "training" | "camp";
