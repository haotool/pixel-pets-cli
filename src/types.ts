/** Shared domain types and constants. */

/** Tier levels - different naming from common gacha systems */
export const TIERS = [
  "bronze",
  "silver", 
  "gold",
  "platinum",
  "diamond",
  "mythic",
] as const;
export type Tier = (typeof TIERS)[number];

/** Creature species. */
export const CREATURES = [
  "slimeling",    // Original: small bouncy creature
  "fluffox",      // Original: fluffy fox-like
  "sparkfin",     // Original: electric fish
  "mossbear",     // Original: nature bear
  "cloudpup",     // Original: sky puppy
  "crystalwing",  // Original: gem butterfly
  "emberclaw",    // Original: fire lizard
  "frostwhisk",   // Original: ice cat
  "thornback",    // Original: plant turtle
  "glowmoth",     // Original: luminous moth
  "sandscale",    // Original: desert snake
  "stormfeather", // Original: thunder bird
  "dewdrop",      // Original: water sprite
  "ironpaw",      // Original: metal wolf
  "vineheart",    // Original: forest spirit
  "nightshade",   // Original: shadow creature
] as const;
export type Creature = (typeof CREATURES)[number];

/** Expression glyphs. */
export const EXPRESSIONS = ["^", "o", "=", "*", "~", "u", "w"] as const;
export type Expression = (typeof EXPRESSIONS)[number];

/** Accessory types. */
export const ACCESSORIES = [
  "none",
  "ribbon",
  "bowtie",
  "flower",
  "bandana",
  "goggles",
  "scarf",
  "bell",
  "feather",
] as const;
export type Accessory = (typeof ACCESSORIES)[number];

/** Attribute names. */
export const ATTRIBUTES = [
  "VITALITY",
  "AGILITY",
  "SPIRIT",
  "LUCK",
  "CHARM",
  "FOCUS",
] as const;
export type Attribute = (typeof ATTRIBUTES)[number];

/** Core creature data */
export interface CreatureCore {
  tier: Tier;
  species: Creature;
  expression: Expression;
  accessory: Accessory;
  sparkle: boolean;
  attributes: Record<Attribute, number>;
}

/** Creature identity */
export interface CreatureIdentity {
  nickname: string;
  trait: string;
}

/** Complete creature */
export interface PixelPet extends CreatureCore, CreatureIdentity {
  obtainedAt: number;
  seedHash: string;
}

/** Tier weights. Total weight: 1000. */
export const TIER_WEIGHTS: Record<Tier, number> = {
  bronze: 450,     // 45%
  silver: 300,     // 30%
  gold: 150,       // 15%
  platinum: 70,    // 7%
  diamond: 25,     // 2.5%
  mythic: 5,       // 0.5%
};

/** Tier display symbols */
export const TIER_SYMBOLS: Record<Tier, string> = {
  bronze: "[B]",
  silver: "[S]",
  gold: "[G]",
  platinum: "[P]",
  diamond: "[D]",
  mythic: "[M]",
};

/** Numeric rank used for comparisons and summaries. */
export const TIER_RANK: Record<Tier, number> = {
  bronze: 0,
  silver: 1,
  gold: 2,
  platinum: 3,
  diamond: 4,
  mythic: 5,
};

/** Tier base values used for attribute generation. */
export const TIER_BASE: Record<Tier, number> = {
  bronze: 10,
  silver: 20,
  gold: 35,
  platinum: 50,
  diamond: 65,
  mythic: 80,
};

/** Sparkle chance per tier. */
export const SPARKLE_CHANCE: Record<Tier, number> = {
  bronze: 0.005,    // 0.5%
  silver: 0.008,    // 0.8%
  gold: 0.012,      // 1.2%
  platinum: 0.02,   // 2%
  diamond: 0.035,   // 3.5%
  mythic: 0.05,     // 5%
};
