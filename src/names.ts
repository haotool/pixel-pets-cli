/** Nickname and trait generation. */

import type { Creature } from "./types.js";

/** Adjective pool. */
const ADJECTIVES = [
  "Brave", "Swift", "Gentle", "Fierce", "Mystic",
  "Noble", "Wild", "Calm", "Bright", "Shadow",
  "Storm", "Frost", "Ember", "Crystal", "Ancient",
  "Young", "Wise", "Bold", "Shy", "Proud",
  "Lucky", "Clever", "Dreamy", "Starry", "Misty",
];

/** Creature-specific suffixes. */
const SUFFIXES: Record<Creature, string[]> = {
  slimeling: ["Bounce", "Wobble", "Jelly", "Goo", "Blob"],
  fluffox: ["Tail", "Whisker", "Paw", "Snout", "Fur"],
  sparkfin: ["Scale", "Fin", "Splash", "Wave", "Current"],
  mossbear: ["Claw", "Growl", "Pelt", "Roar", "Den"],
  cloudpup: ["Bark", "Wag", "Sniff", "Howl", "Pounce"],
  crystalwing: ["Flutter", "Shimmer", "Glint", "Facet", "Prism"],
  emberclaw: ["Flame", "Spark", "Ash", "Blaze", "Scorch"],
  frostwhisk: ["Chill", "Flake", "Ice", "Frost", "Shiver"],
  thornback: ["Shell", "Spike", "Leaf", "Root", "Vine"],
  glowmoth: ["Wing", "Dust", "Light", "Gleam", "Flicker"],
  sandscale: ["Coil", "Hiss", "Dune", "Slither", "Fang"],
  stormfeather: ["Talon", "Screech", "Gust", "Thunder", "Bolt"],
  dewdrop: ["Ripple", "Mist", "Drip", "Bubble", "Stream"],
  ironpaw: ["Steel", "Clank", "Gear", "Bolt", "Chrome"],
  vineheart: ["Bloom", "Petal", "Sprout", "Thorn", "Blossom"],
  nightshade: ["Shade", "Whisper", "Dusk", "Gloom", "Veil"],
};

/** Trait templates. */
const TRAIT_TEMPLATES = [
  "Loves to {action} during {time}",
  "Always {behavior} when {condition}",
  "Has a habit of {quirk}",
  "Known for being {quality}",
  "Enjoys {activity} with friends",
  "Often found {location}",
  "Dreams of {aspiration}",
  "Secretly {secret}",
];

const ACTIONS = [
  "nap", "explore", "play", "sing", "dance",
  "collect shiny things", "chase butterflies", "stargaze",
];

const TIMES = [
  "sunny afternoons", "rainy days", "moonlit nights",
  "early mornings", "twilight hours", "snowy evenings",
];

const BEHAVIORS = [
  "gets excited", "becomes calm", "starts humming",
  "bounces around", "hides away", "seeks attention",
];

const CONDITIONS = [
  "meeting new friends", "hearing music", "seeing food",
  "it's bedtime", "there's a storm", "someone's sad",
];

const QUIRKS = [
  "collecting pebbles", "talking to plants", "making funny faces",
  "spinning in circles", "mimicking sounds", "hoarding snacks",
];

const QUALITIES = [
  "incredibly loyal", "surprisingly clever", "endlessly curious",
  "unexpectedly brave", "remarkably patient", "genuinely kind",
];

const ACTIVITIES = [
  "playing games", "sharing treats", "going on adventures",
  "solving puzzles", "telling stories", "watching clouds",
];

const LOCATIONS = [
  "near cozy spots", "under tall trees", "by flowing water",
  "in sunny patches", "among flowers", "on high places",
];

const ASPIRATIONS = [
  "becoming a hero", "finding treasure", "making everyone smile",
  "learning magic", "exploring the world", "becoming the best",
];

const SECRETS = [
  "loves being pampered", "fears the dark", "has a sweet tooth",
  "enjoys being alone sometimes", "is ticklish", "loves lullabies",
];

/** Lightweight seeded RNG for deterministic text output. */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return (s / 4294967296);
  };
}

/** Select an item with a seeded RNG. */
function pickSeeded<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

/** Generate nickname from seed */
export function generateNickname(species: Creature, seed: number): string {
  const rng = seededRandom(seed);
  const adj = pickSeeded(rng, ADJECTIVES);
  const suffix = pickSeeded(rng, SUFFIXES[species]);
  return `${adj} ${suffix}`;
}

/** Generate trait from seed */
export function generateTrait(seed: number): string {
  const rng = seededRandom(seed + 1000);
  const template = pickSeeded(rng, TRAIT_TEMPLATES);
  
  return template
    .replace("{action}", pickSeeded(rng, ACTIONS))
    .replace("{time}", pickSeeded(rng, TIMES))
    .replace("{behavior}", pickSeeded(rng, BEHAVIORS))
    .replace("{condition}", pickSeeded(rng, CONDITIONS))
    .replace("{quirk}", pickSeeded(rng, QUIRKS))
    .replace("{quality}", pickSeeded(rng, QUALITIES))
    .replace("{activity}", pickSeeded(rng, ACTIVITIES))
    .replace("{location}", pickSeeded(rng, LOCATIONS))
    .replace("{aspiration}", pickSeeded(rng, ASPIRATIONS))
    .replace("{secret}", pickSeeded(rng, SECRETS));
}
