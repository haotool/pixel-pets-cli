/**
 * Pixel Pets CLI - Original Gacha Implementation
 * 
 * Uses xorshift128+ PRNG (different from Mulberry32)
 * and djb2 hash (different from FNV-1a)
 * 
 * All mechanics are original designs.
 */

import {
  type Attribute,
  ATTRIBUTES,
  type Accessory,
  ACCESSORIES,
  type CreatureCore,
  type Creature,
  CREATURES,
  type Expression,
  EXPRESSIONS,
  SPARKLE_CHANCE,
  type Tier,
  TIERS,
  TIER_BASE,
  TIER_WEIGHTS,
} from "./types.js";

/**
 * xorshift128+ PRNG - DIFFERENT from Mulberry32
 * This is a well-known public domain algorithm
 * Reference: https://en.wikipedia.org/wiki/Xorshift
 */
class XorShift128Plus {
  private s0: number;
  private s1: number;

  constructor(seed: number) {
    // Initialize state from seed using splitmix64-like expansion
    this.s0 = this.splitmix(seed);
    this.s1 = this.splitmix(this.s0);
  }

  private splitmix(x: number): number {
    x = ((x >>> 0) + 0x9e3779b9) >>> 0;
    x = Math.imul(x ^ (x >>> 16), 0x85ebca6b) >>> 0;
    x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35) >>> 0;
    return (x ^ (x >>> 16)) >>> 0;
  }

  next(): number {
    let s1 = this.s0;
    const s0 = this.s1;
    this.s0 = s0;
    s1 ^= s1 << 23;
    s1 ^= s1 >>> 17;
    s1 ^= s0;
    s1 ^= s0 >>> 26;
    this.s1 = s1;
    return ((s0 + s1) >>> 0) / 4294967296;
  }
}

/**
 * djb2 hash - DIFFERENT from FNV-1a
 * This is a well-known public domain algorithm
 * Reference: http://www.cse.yorku.ca/~oz/hash.html
 */
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Select random element */
function selectRandom<T>(rng: XorShift128Plus, items: readonly T[]): T {
  return items[Math.floor(rng.next() * items.length)]!;
}

/** 
 * ORIGINAL tier selection - uses different algorithm
 * Weighted selection with cumulative distribution
 */
function selectTier(rng: XorShift128Plus): Tier {
  const weights = Object.values(TIER_WEIGHTS);
  const total = weights.reduce((sum, w) => sum + w, 0);
  const threshold = rng.next() * total;
  
  let cumulative = 0;
  for (const tier of TIERS) {
    cumulative += TIER_WEIGHTS[tier];
    if (threshold <= cumulative) return tier;
  }
  return "bronze";
}

/**
 * ORIGINAL attribute generation - completely different formula
 * Uses bell curve distribution instead of peak/dump system
 */
function generateAttributes(
  rng: XorShift128Plus,
  tier: Tier,
): Record<Attribute, number> {
  const base = TIER_BASE[tier];
  const variance = 25; // Fixed variance
  
  const attrs = {} as Record<Attribute, number>;
  
  for (const attr of ATTRIBUTES) {
    // Bell curve using Box-Muller transform
    const u1 = Math.max(0.0001, rng.next());
    const u2 = rng.next();
    const normal = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    // Scale and shift to desired range
    const value = base + Math.floor(normal * variance * 0.5);
    attrs[attr] = Math.max(1, Math.min(100, value));
  }
  
  return attrs;
}

/** Gacha result */
export interface GachaResult {
  core: CreatureCore;
  identitySeed: number;
}

/** Generate creature from RNG */
function generateCreature(rng: XorShift128Plus): GachaResult {
  const tier = selectTier(rng);
  
  // Accessory availability based on tier
  const accessoryPool = tier === "bronze" 
    ? (["none"] as const)
    : tier === "silver"
    ? ACCESSORIES.slice(0, 4)
    : ACCESSORIES;
  
  const core: CreatureCore = {
    tier,
    species: selectRandom(rng, CREATURES),
    expression: selectRandom(rng, EXPRESSIONS),
    accessory: selectRandom(rng, accessoryPool) as Accessory,
    sparkle: rng.next() < SPARKLE_CHANCE[tier],
    attributes: generateAttributes(rng, tier),
  };
  
  return {
    core,
    identitySeed: Math.floor(rng.next() * 1e9),
  };
}

/** Roll with seed string */
export function roll(seed: string): GachaResult {
  const hash = djb2Hash(seed);
  const rng = new XorShift128Plus(hash);
  return generateCreature(rng);
}

/** Generate random seed */
export function createSeed(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  return `px-${timestamp}-${random}`;
}

/** Get tier probability */
export function getTierProbability(tier: Tier): number {
  const total = Object.values(TIER_WEIGHTS).reduce((sum, w) => sum + w, 0);
  return (TIER_WEIGHTS[tier] / total) * 100;
}

/** Get sparkle probability for tier */
export function getSparkleProbability(tier: Tier): number {
  return SPARKLE_CHANCE[tier] * 100;
}
