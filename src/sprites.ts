/** ASCII sprite definitions and rendering helpers. */

import type { Accessory, Creature, CreatureCore, FrameId } from "./types.js";
import { BLINK_GLYPH, SPRITE_HEIGHT, SPRITE_WIDTH } from "./types.js";

/**
 * 5-line sprites with {E} eye placeholders. Each species has 3 frames.
 * Each line renders to exactly 12 characters after {E} replacement.
 * 
 * CRITICAL ALIGNMENT RULES:
 * 1. Every line must be exactly 12 rendered characters
 * 2. Visual center of each line should be at position 5-6
 * 3. Eye pattern `(o o)` must align with head features above
 * 
 * Raw length formula: 12 + (placeholder_count * 2)
 */
const SPRITES: Record<Creature, [string[], string[], string[]]> = {
  // Slime - simple round blob, perfectly centered
  slimeling: [
    ["   .---.    ", "   ({E} {E})    ", "  (     )   ", "   \\___/    ", "   ~~~~~    "],
    ["    ___     ", "   ({E} {E})    ", "  (     )   ", "   \\___/    ", "   ~~~~~    "],
    ["   .---.    ", "   ({E} {E})    ", " (       )  ", "  \\_____/   ", "   ~~~~~    "],
  ],
  // Fox - ears centered above eyes
  fluffox: [
    ["  /\\   /\\   ", "   ({E} {E})    ", "    (w)     ", "   /| |\\    ", "  (_   _)   "],
    ["  /\\_/\\     ", "   ({E} {E})    ", "    (w)     ", "   /| |\\    ", "  (_   _)   "],
    ["  /\\   /\\   ", "   ({E} {E})    ", "   ('w')    ", "   /| |\\    ", "  (_   _)~  "],
  ],
  // Fish - horizontal fish shape
  sparkfin: [
    ["            ", "   ><{E}>     ", "  /----\\    ", " <  ~~  >   ", "  \\----/    "],
    ["     ~      ", "   ><{E}>     ", "  /----\\    ", " <  ~~  >   ", "  \\----/    "],
    ["            ", "  *><{E}>*    ", "  /----\\    ", " <  ~~  >   ", "  \\----/    "],
  ],
  // Bear - round ears centered
  mossbear: [
    ["  (^ ^)     ", "   ({E} {E})    ", "   (  )     ", "   /|\\      ", "  / | \\     "],
    ["  (^ ^)     ", "   ({E} {E})    ", "   ('_')    ", "   /|\\      ", "  / | \\     "],
    ["  (^ ^)~    ", "   ({E} {E})    ", "   (  )     ", "   /|\\      ", "  / | \\     "],
  ],
  // Puppy - floppy ears centered
  cloudpup: [
    ["   U U      ", "   ({E} {E})    ", "    (w)     ", "   /| |\\    ", "   ~~~~~    "],
    ["   U U      ", "   ({E} {E})    ", "    (w)     ", "  ~/| |\\~   ", "   ~~~~~    "],
    ["  ~U U~     ", "   ({E} {E})    ", "    (w)     ", "   /| |\\    ", "   ~~~~~    "],
  ],
  // Crystal butterfly - wings centered
  crystalwing: [
    ["  *\\  /*    ", "   ({E} {E})    ", "    ||      ", "   /  \\     ", "   *  *     "],
    [" **\\  /**   ", "   ({E} {E})    ", "    ||      ", "   /  \\     ", "   *  *     "],
    ["  *\\  /*    ", "  *({E} {E})*   ", "    ||      ", "   /  \\     ", "   *  *     "],
  ],
  // Fire dragon - flame crown centered
  emberclaw: [
    ["  ~^~^~     ", "   ({E} {E})    ", "   \\==/     ", "   /||\\     ", "   ~ ~      "],
    [" ~*~^~*~    ", "   ({E} {E})    ", "   \\==/     ", "   /||\\     ", "   ~ ~      "],
    ["  ~^~^~     ", "   ({E} {E})    ", "   \\==/     ", "  ~/||\\~    ", "   ~ ~      "],
  ],
  // Cat - pointed ears centered
  frostwhisk: [
    ["   /\\_/\\    ", "   ({E} {E})    ", "   =\\/=     ", "    ||      ", "   *~~*     "],
    ["   /\\_/\\    ", "   ({E} {E})    ", "   =\\/=     ", "   *||*     ", "   *~~*     "],
    ["   /\\_/\\    ", "   ({E} {E})    ", "   =\\/=     ", "    ||      ", "  **~~**    "],
  ],
  // Armored turtle - spiky shell centered
  thornback: [
    ["  /\\/\\/\\    ", "   ({E} {E})    ", "  |[==]|    ", "   \\__/     ", "   d  b     "],
    ["  /\\/\\/\\    ", "   ({E} {E})    ", "  |[==]|    ", "   \\__/     ", "  d    b    "],
    ["  /\\/\\/\\    ", "   ({E} {E})    ", "  |[==]|    ", "   \\__/     ", "   d  b     "],
  ],
  // Moth - antennae centered
  glowmoth: [
    ["   \\* */    ", "   ({E} {E})    ", "    ||      ", "   /||\\     ", "   *  *     "],
    ["  \\** **/   ", "   ({E} {E})    ", "    ||      ", "   /||\\     ", "   *  *     "],
    ["   \\* */    ", "  *({E} {E})*   ", "    ||      ", "   /||\\     ", "   *  *     "],
  ],
  // Snake - coiled body centered
  sandscale: [
    ["   ({E} {E})    ", "   /--\\     ", "  /    \\    ", "  (~~~~)    ", "   ~~~~     "],
    ["   ({E} {E})    ", "  ~/--\\~    ", "  /    \\    ", "  (~~~~)    ", "   ~~~~     "],
    ["   ({E} {E})    ", "   /--\\     ", "  /    \\    ", "  (~~~~)    ", "  ~~~~~~    "],
  ],
  // Bird - wings centered
  stormfeather: [
    ["   \\\\//     ", "   ({E} {E})    ", "    <v>     ", "    /|\\     ", "    / \\     "],
    ["  *\\\\//     ", "   ({E} {E})    ", "    <v>     ", "    /|\\     ", "    / \\     "],
    ["   \\\\//     ", "   ({E} {E})    ", "   ~<v>~    ", "    /|\\     ", "    / \\     "],
  ],
  // Water droplet - bubble centered
  dewdrop: [
    ["     o      ", "   ({E} {E})    ", "   (  )     ", "   \\__/     ", "   ~~~~     "],
    ["    o o     ", "   ({E} {E})    ", "   (  )     ", "   \\__/     ", "   ~~~~     "],
    ["     o      ", "   ({E} {E})    ", "   (~~)     ", "   \\__/     ", "  ~~~~~~    "],
  ],
  // Robot dog - square features centered
  ironpaw: [
    ["   _[]_     ", "   [{E} {E}]    ", "   [==]     ", "   |  |     ", "  _|__|_    "],
    ["   _[]_     ", "   [{E} {E}]    ", "   [==]     ", "   |__|     ", "  _|  |_    "],
    ["   _[]_     ", "   [{E} {E}]    ", "   [==]=    ", "   |  |     ", "  _|__|_    "],
  ],
  // Plant creature - leaves centered
  vineheart: [
    ["   ~\\/~     ", "   ({E} {E})    ", "   (  )     ", "    \\/      ", "   ~||~     "],
    ["  ~~\\/~~    ", "   ({E} {E})    ", "   (  )     ", "    \\/      ", "   ~||~     "],
    ["   ~\\/~     ", "   ({E} {E})    ", "  ~(  )~    ", "    \\/      ", "   ~||~     "],
  ],
  // Ghost - ethereal centered
  nightshade: [
    ["    ._.     ", "   ({E} {E})    ", "   (   )    ", "    \\/      ", "     .      "],
    ["   . _ .    ", "   ({E} {E})    ", "  .(   ).   ", "    \\/      ", "    . .     "],
    ["    ._.     ", "   ({E} {E})    ", "   (   )    ", "    \\/      ", "     .      "],
  ],
};

/** Accessory decorations rendered above the base sprite. Width: 12 chars. */
const ACCESSORY_LINES: Record<Accessory, string> = {
  none: "",
  ribbon: "     ~      ",
  bowtie: "    ><>     ",
  flower: "     @      ",
  bandana: "   ~~~~     ",
  goggles: "   [==]     ",
  scarf: "   ////     ",
  bell: "     o      ",
  feather: "     /      ",
};

/** Render sprite with expression and accessory. */
export function renderSprite(core: CreatureCore, frameId: FrameId = 0): string[] {
  const frameIndex = frameId === -1 ? 0 : frameId;
  const expression = frameId === -1 ? BLINK_GLYPH : core.expression;
  const body = SPRITES[core.species][frameIndex].map((line) =>
    line.replaceAll("{E}", expression)
  );
  return core.accessory === "none"
    ? body
    : [ACCESSORY_LINES[core.accessory], ...body];
}

/** Get frame count for species. */
export function getFrameCount(_species: Creature): number {
  return 3;
}

/** Render compact face for list display. Each species has unique face pattern. */
export function renderFace(core: CreatureCore): string {
  const e = core.expression;
  const faces: Record<Creature, string> = {
    slimeling: `(${e}'${e})`,
    fluffox: `(${e}w${e})`,
    sparkfin: `><${e}>`,
    mossbear: `(${e}_${e})`,
    cloudpup: `U${e}w${e}U`,
    crystalwing: `*${e}${e}*`,
    emberclaw: `^${e}${e}^`,
    frostwhisk: `=${e}=${e}=`,
    thornback: `[${e} ${e}]`,
    glowmoth: `(${e}*${e})`,
    sandscale: `/${e}${e}\\`,
    stormfeather: `(${e}v${e})`,
    dewdrop: `o${e}${e}o`,
    ironpaw: `[${e}=${e}]`,
    vineheart: `~${e}|${e}~`,
    nightshade: `.${e}${e}.`,
  };
  return faces[core.species];
}

/** Sparkle frames for animated mode. */
export const SPARKLE_FRAMES = ["✦", "✧", "·", "✧"] as const;

/** Calculate rendered width (after {E} replacement). */
function getRenderedWidth(line: string): number {
  const placeholderCount = (line.match(/\{E\}/g) || []).length;
  return line.length - placeholderCount * 2;
}

/** Validate all sprites have correct structure (5 lines × 12 rendered chars). */
export function validateSpriteDimensions(): boolean {
  for (const species of Object.keys(SPRITES) as Creature[]) {
    const frames = SPRITES[species];
    if (frames.length !== 3) return false;
    for (const frame of frames) {
      if (frame.length !== SPRITE_HEIGHT) return false;
      for (const line of frame) {
        if (getRenderedWidth(line) !== SPRITE_WIDTH) return false;
      }
    }
  }
  return true;
}

/** Get validation errors for debugging. */
export function getSpriteValidationErrors(): string[] {
  const errors: string[] = [];
  for (const species of Object.keys(SPRITES) as Creature[]) {
    const frames = SPRITES[species];
    if (frames.length !== 3) {
      errors.push(`${species}: expected 3 frames, got ${frames.length}`);
      continue;
    }
    for (let f = 0; f < frames.length; f++) {
      const frame = frames[f]!;
      if (frame.length !== SPRITE_HEIGHT) {
        errors.push(`${species} frame ${f}: expected ${SPRITE_HEIGHT} lines, got ${frame.length}`);
      }
      for (let l = 0; l < frame.length; l++) {
        const line = frame[l]!;
        const rendered = getRenderedWidth(line);
        if (rendered !== SPRITE_WIDTH) {
          errors.push(`${species} frame ${f} line ${l}: expected ${SPRITE_WIDTH} rendered chars, got ${rendered} ("${line}")`);
        }
      }
    }
  }
  return errors;
}
