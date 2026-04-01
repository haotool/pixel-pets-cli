/**
 * Pixel Pets CLI - Display Functions
 * 
 * Terminal output and animations.
 */

import chalk from "chalk";
import type { Attribute, PixelPet, Tier } from "./types.js";
import { ATTRIBUTES, TIER_SYMBOLS } from "./types.js";
import {
  renderSprite,
  renderFace,
  getFrameCount,
  SPARKLE_FRAMES,
} from "./sprites.js";
import { getTierProbability, getSparkleProbability } from "./gacha.js";

/** Tier colors */
const TIER_COLORS: Record<Tier, typeof chalk> = {
  bronze: chalk.hex("#CD7F32"),
  silver: chalk.hex("#C0C0C0"),
  gold: chalk.hex("#FFD700"),
  platinum: chalk.hex("#E5E4E2"),
  diamond: chalk.hex("#B9F2FF"),
  mythic: chalk.hex("#FF00FF"),
};

/** Render attribute bar */
function renderBar(value: number, width = 12): string {
  const filled = Math.round((value / 100) * width);
  return chalk.green("=".repeat(filled)) + chalk.gray("-".repeat(width - filled));
}

/** Format attribute line */
function formatAttribute(name: Attribute, value: number): string {
  const bar = renderBar(value);
  const num = value.toString().padStart(3);
  return `${name.padEnd(10)} ${bar} ${num}`;
}

/** Display pet card */
export function displayPetCard(pet: PixelPet): void {
  const color = TIER_COLORS[pet.tier];
  const symbol = TIER_SYMBOLS[pet.tier];
  const prob = getTierProbability(pet.tier).toFixed(1);
  const W = 42;

  console.log();
  console.log(color("+" + "-".repeat(W) + "+"));

  const sparkleTag = pet.sparkle ? " * SPARKLE *" : "";
  const title = `${pet.nickname}${sparkleTag}`;
  console.log(color("|") + chalk.bold.white(` ${title}`.padEnd(W)) + color("|"));

  const tierLine = `${symbol} ${pet.tier.toUpperCase()} (${prob}%)`;
  console.log(color("|") + color(` ${tierLine}`.padEnd(W)) + color("|"));

  console.log(color("+" + "-".repeat(W) + "+"));

  const face = renderFace(pet);
  console.log(
    color("|") +
      chalk.white(`  Species: ${pet.species.padEnd(12)} Face: ${face}`.padEnd(W)) +
      color("|")
  );
  console.log(
    color("|") +
      chalk.white(`  Expression: ${pet.expression}  Accessory: ${pet.accessory}`.padEnd(W)) +
      color("|")
  );

  console.log(color("+" + "-".repeat(W) + "+"));
  console.log(color("|") + chalk.bold.white("  ATTRIBUTES".padEnd(W)) + color("|"));

  for (const attr of ATTRIBUTES) {
    const line = formatAttribute(attr, pet.attributes[attr]);
    console.log(color("|") + `  ${line}`.padEnd(W) + color("|"));
  }

  console.log(color("+" + "-".repeat(W) + "+"));
  console.log(color("|") + chalk.bold.white("  SPRITE".padEnd(W)) + color("|"));

  const sprite = renderSprite(pet, 0);
  for (const line of sprite) {
    const displayLine = pet.sparkle ? `  ${line} *` : `  ${line}`;
    console.log(color("|") + displayLine.padEnd(W) + color("|"));
  }

  console.log(color("+" + "-".repeat(W) + "+"));

  const traitLines = wrapText(pet.trait, W - 6);
  console.log(
    color("|") + chalk.gray(`  "${traitLines[0]}`.padEnd(W)) + color("|")
  );
  for (let i = 1; i < traitLines.length; i++) {
    console.log(
      color("|") + chalk.gray(`   ${traitLines[i]}`.padEnd(W)) + color("|")
    );
  }
  if (traitLines.length === 1) {
    console.log(color("|") + chalk.gray(`  "`.padEnd(W)) + color("|"));
  } else {
    const lastIdx = traitLines.length - 1;
    // Close quote handled in last line
  }

  console.log(color("+" + "-".repeat(W) + "+"));
  console.log();
}

/** Wrap text to width */
function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (current.length + word.length + 1 <= maxWidth) {
      current += (current ? " " : "") + word;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  return lines.length > 0 ? lines : [""];
}

/** Display gacha animation */
export async function displayGachaAnimation(tier: Tier): Promise<void> {
  const color = TIER_COLORS[tier];
  const frames = ["[    ]", "[ .  ]", "[ .. ]", "[... ]", "[....]"];

  process.stdout.write("\n  Summoning");

  for (let i = 0; i < 8; i++) {
    const frame = frames[i % frames.length];
    process.stdout.write(`\r  Summoning ${color(frame!)}`);
    await sleep(200);
  }

  console.log(`\r  Summoning ${color("[DONE]")}\n`);
}

/** Display pet list */
export function displayPetList(pets: PixelPet[]): void {
  if (pets.length === 0) {
    console.log(chalk.yellow("\n  No pets in collection yet!"));
    console.log(chalk.gray("  Use 'pull' to summon your first pet.\n"));
    return;
  }

  console.log(chalk.bold(`\n  Collection (${pets.length} pets)\n`));
  console.log(
    chalk.gray("  " + "-".repeat(50))
  );

  for (const pet of pets) {
    const color = TIER_COLORS[pet.tier];
    const symbol = TIER_SYMBOLS[pet.tier];
    const sparkle = pet.sparkle ? " *" : "";
    const face = renderFace(pet);

    console.log(
      `  ${color(symbol)} ${chalk.white(pet.nickname.padEnd(20))} ${face}${sparkle}`
    );
  }

  console.log(chalk.gray("  " + "-".repeat(50)) + "\n");
}

/** Display animated sprite */
export async function displayAnimatedSprite(
  pet: PixelPet,
  duration = 3000
): Promise<void> {
  const frameCount = getFrameCount(pet.species);
  const startTime = Date.now();
  let frame = 0;

  console.log();

  while (Date.now() - startTime < duration) {
    const sprite = renderSprite(pet, frame);
    const color = TIER_COLORS[pet.tier];

    // Clear previous frame
    process.stdout.write("\x1B[4A");

    for (const line of sprite) {
      const sparkle = pet.sparkle
        ? ` ${SPARKLE_FRAMES[frame % SPARKLE_FRAMES.length]}`
        : "";
      console.log(color(`  ${line}${sparkle}`));
    }

    frame = (frame + 1) % frameCount;
    await sleep(400);
  }

  console.log();
}

/** Display help */
export function displayHelp(): void {
  console.log(`
  ${chalk.bold("Pixel Pets CLI")} - Terminal Pet Collection Game

  ${chalk.bold("Commands:")}
    pull [seed]      Summon a new pet (optional seed for deterministic result)
    list             Show your pet collection
    show <name>      Display detailed pet card
    animate <name>   Watch pet animation
    stats            Show collection statistics
    rates            Display summon rates
    clear --confirm  Clear all pets
    help             Show this help

  ${chalk.bold("Examples:")}
    pixel-pets pull
    pixel-pets pull my-lucky-seed
    pixel-pets show "Brave Bounce"
    pixel-pets rates
`);
}

/** Display rates */
export function displayRates(): void {
  console.log(chalk.bold("\n  Summon Rates\n"));
  console.log(chalk.gray("  " + "-".repeat(40)));

  const tiers: Tier[] = ["bronze", "silver", "gold", "platinum", "diamond", "mythic"];

  for (const tier of tiers) {
    const color = TIER_COLORS[tier];
    const symbol = TIER_SYMBOLS[tier];
    const prob = getTierProbability(tier).toFixed(1).padStart(5);
    const sparkle = getSparkleProbability(tier).toFixed(2).padStart(5);

    console.log(
      `  ${color(symbol)} ${tier.padEnd(10)} ${prob}%  (sparkle: ${sparkle}%)`
    );
  }

  console.log(chalk.gray("  " + "-".repeat(40)));
  console.log(chalk.gray("\n  Note: Sparkle chance varies by tier.\n"));
}

/** Display collection stats */
export function displayStats(pets: PixelPet[]): void {
  console.log(chalk.bold("\n  Collection Statistics\n"));

  if (pets.length === 0) {
    console.log(chalk.yellow("  No pets collected yet.\n"));
    return;
  }

  const tierCounts: Record<Tier, number> = {
    bronze: 0,
    silver: 0,
    gold: 0,
    platinum: 0,
    diamond: 0,
    mythic: 0,
  };

  let sparkleCount = 0;

  for (const pet of pets) {
    tierCounts[pet.tier]++;
    if (pet.sparkle) sparkleCount++;
  }

  console.log(chalk.gray("  " + "-".repeat(30)));
  console.log(`  Total Pets: ${chalk.bold(pets.length.toString())}`);
  console.log(`  Sparkle Pets: ${chalk.bold(sparkleCount.toString())}`);
  console.log(chalk.gray("  " + "-".repeat(30)));

  for (const tier of Object.keys(tierCounts) as Tier[]) {
    const count = tierCounts[tier];
    if (count > 0) {
      const color = TIER_COLORS[tier];
      console.log(`  ${color(TIER_SYMBOLS[tier])} ${tier.padEnd(10)} ${count}`);
    }
  }

  console.log(chalk.gray("  " + "-".repeat(30)) + "\n");
}

/** Sleep utility */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
