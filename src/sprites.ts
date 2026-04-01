/**
 * Pixel Pets CLI - Original ASCII Sprites
 * 
 * All sprites are ORIGINAL designs created specifically for this project.
 * These are completely different from any existing ASCII pet systems.
 */

import type { Accessory, Creature, CreatureCore, Expression } from "./types.js";

/**
 * ORIGINAL 4-line sprites with {E} expression placeholder
 * Each creature has 2 animation frames
 * All designs are unique creations
 */
const SPRITES: Record<Creature, string[][]> = {
  slimeling: [
    ["   ___   ", "  ({E}{E})  ", " (    ) ", "  ~~~~  "],
    ["   ___   ", "  ({E}{E})  ", "  (  )  ", "  ~~~~  "],
  ],
  fluffox: [
    [" /\\ _ /\\ ", "( {E} v {E} )", " \\ === / ", "  |   |  "],
    [" /\\   /\\ ", "( {E} v {E} )", " \\ === / ", "  |   |~ "],
  ],
  sparkfin: [
    ["  ><{E}>  ", " /====\\ ", "<  ~~  >", " \\====/  "],
    ["  ><{E}>  ", " /====\\ ", "<  ~~  >", "  \\==/   "],
  ],
  mossbear: [
    ["  ^   ^  ", " ({E}   {E}) ", " ( === ) ", "  |___|  "],
    ["  ^   ^  ", " ({E}   {E}) ", " ( === ) ", "  |___|~ "],
  ],
  cloudpup: [
    ["  n   n  ", " ({E} w {E}) ", "  (   )  ", " ~~   ~~ "],
    ["  n   n  ", " ({E} w {E}) ", "  (   )  ", "  ~~ ~~  "],
  ],
  crystalwing: [
    [" *\\   /* ", "  ({E}{E})  ", " *|   |* ", "   \\_/   "],
    ["  \\   /  ", " *({E}{E})* ", "  |   |  ", "   \\_/   "],
  ],
  emberclaw: [
    ["  ~ ~ ~  ", " /{E}   {E}\\ ", " |=====| ", "  /| |\\  "],
    [" ~ ~ ~ ~ ", " /{E}   {E}\\ ", " |=====| ", "  /| |\\  "],
  ],
  frostwhisk: [
    ["  /\\_/\\  ", " ( {E} {E} ) ", "  >   <  ", " *~~~~~* "],
    ["  /\\_/\\  ", " ( {E} {E} ) ", "  >   <  ", "  ~~~~~  "],
  ],
  thornback: [
    [" /\\/\\/\\  ", "| {E}   {E} |", "|[=====]|", " \\_____/ "],
    [" /\\/\\/\\  ", "| {E}   {E} |", "|[=====]|", "  \\___/  "],
  ],
  glowmoth: [
    [" \\*   */ ", "  ({E}{E})  ", " /|   |\\ ", "  *   *  "],
    ["  *   *  ", "  ({E}{E})  ", " \\|   |/ ", "  *   *  "],
  ],
  sandscale: [
    ["   {E}{E}   ", "  /==\\  ", " /====\\ ", "~~~~~~~~ "],
    ["   {E}{E}   ", "  /==\\  ", " /====\\ ", " ~~~~~~~ "],
  ],
  stormfeather: [
    [" \\\\   // ", "  ({E}{E})  ", " //===\\\\ ", "   | |   "],
    ["  \\   /  ", "  ({E}{E})  ", " //===\\\\ ", "   | |   "],
  ],
  dewdrop: [
    ["    o    ", "  ({E}{E})  ", " (    ) ", "  `~~`   "],
    ["   o o   ", "  ({E}{E})  ", "  (  )  ", "   ~~    "],
  ],
  ironpaw: [
    ["  [   ]  ", " [{E}   {E}] ", " [=====] ", "  |___|  "],
    ["  [   ]  ", " [{E}   {E}] ", " [=====] ", "  |___|- "],
  ],
  vineheart: [
    [" ~\\   /~ ", "  ({E}{E})  ", " ~|   |~ ", "  \\___/  "],
    ["  \\   /  ", " ~({E}{E})~ ", "  |   |  ", " ~\\___/~ "],
  ],
  nightshade: [
    ["  .   .  ", " .{E}   {E}. ", "  (   )  ", " . \\_/ . "],
    [" .     . ", "  {E}   {E}  ", " .(   ). ", "   \\_/   "],
  ],
};

/** Accessory decorations (placed above sprite) */
const ACCESSORY_LINES: Record<Accessory, string> = {
  none: "",
  ribbon: "    ~    ",
  bowtie: "   ><>   ",
  flower: "   @     ",
  bandana: "  ~~~~   ",
  goggles: "  [==]   ",
  scarf: "  ////   ",
  bell: "    o    ",
  feather: "    /    ",
};

/** Render sprite with expression and accessory */
export function renderSprite(core: CreatureCore, frame = 0): string[] {
  const frames = SPRITES[core.species];
  const body = frames[frame % frames.length]!.map((line) =>
    line.replaceAll("{E}", core.expression)
  );
  return core.accessory === "none"
    ? body
    : [ACCESSORY_LINES[core.accessory], ...body];
}

/** Get frame count for species */
export function getFrameCount(species: Creature): number {
  return SPRITES[species].length;
}

/** Render compact face */
export function renderFace(core: CreatureCore): string {
  const e = core.expression;
  const faces: Record<Creature, string> = {
    slimeling: `(${e}${e})`,
    fluffox: `(${e}v${e})`,
    sparkfin: `><${e}>`,
    mossbear: `(${e}_${e})`,
    cloudpup: `(${e}w${e})`,
    crystalwing: `*${e}${e}*`,
    emberclaw: `/${e}${e}\\`,
    frostwhisk: `(${e}.${e})`,
    thornback: `[${e}_${e}]`,
    glowmoth: `*${e}${e}*`,
    sandscale: `~${e}${e}~`,
    stormfeather: `(${e}${e})`,
    dewdrop: `o${e}${e}o`,
    ironpaw: `[${e}${e}]`,
    vineheart: `~${e}${e}~`,
    nightshade: `.${e}${e}.`,
  };
  return faces[core.species];
}

/** Sparkle effect frames */
export const SPARKLE_FRAMES = ["*", "+", ".", "*"];

/** Affection animation frames */
export const AFFECTION_FRAMES = [
  "   <3   <3  ",
  "  <3  <3    ",
  " <3   <3  <3",
  "<3  <3      ",
  ".    .   .  ",
];
