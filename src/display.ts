/**
 * Pixel Pets CLI - Display Functions
 * 
 * Terminal output, animations, and gacha effects.
 */

import chalk from "chalk";
import ora from "ora";
import type { Attribute, PixelPet, Tier } from "./types.js";
import { ATTRIBUTES, TIER_SYMBOLS, TIERS } from "./types.js";
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

/** Tier index for comparison */
const TIER_INDEX: Record<Tier, number> = {
  bronze: 0,
  silver: 1,
  gold: 2,
  platinum: 3,
  diamond: 4,
  mythic: 5,
};

/** Check if tier meets target */
export function tierMeetsTarget(tier: Tier, target: Tier): boolean {
  return TIER_INDEX[tier] >= TIER_INDEX[target];
}

/** Parse tier from string */
export function parseTier(input: string): Tier | null {
  const lower = input.toLowerCase();
  for (const tier of TIERS) {
    if (tier === lower || tier[0] === lower) {
      return tier;
    }
  }
  return null;
}

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
export function displayPetCard(pet: PixelPet, compact = false): void {
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

  if (!compact) {
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
  }

  console.log(color("+" + "-".repeat(W) + "+"));
  console.log();
}

/** Display compact pet summary */
export function displayPetSummary(pet: PixelPet, index: number): void {
  const color = TIER_COLORS[pet.tier];
  const symbol = TIER_SYMBOLS[pet.tier];
  const sparkle = pet.sparkle ? chalk.yellow(" *") : "";
  const face = renderFace(pet);
  
  console.log(
    chalk.gray(`  #${(index + 1).toString().padStart(3)}`) +
    ` ${color(symbol)} ` +
    chalk.white(pet.nickname.padEnd(18)) +
    ` ${face}${sparkle}`
  );
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

/** Gacha animation frames */
const GACHA_FRAMES = [
  "       ",
  "   *   ",
  "  * *  ",
  " * * * ",
  "* * * *",
  " * * * ",
  "  * *  ",
  "   *   ",
];

const REVEAL_FRAMES = [
  "[      ]",
  "[*     ]",
  "[**    ]",
  "[***   ]",
  "[****  ]",
  "[***** ]",
  "[******]",
];

/** Display premium gacha animation */
export async function displayGachaAnimation(tier: Tier): Promise<void> {
  const color = TIER_COLORS[tier];
  
  // Phase 1: Charging animation
  const spinner = ora({
    text: chalk.cyan("Gathering energy..."),
    spinner: "dots",
    color: "cyan",
  }).start();

  await sleep(600);
  spinner.text = chalk.cyan("Channeling power...");
  await sleep(600);
  spinner.text = chalk.yellow("Summoning creature...");
  spinner.color = "yellow";
  await sleep(600);
  spinner.stop();

  // Phase 2: Sparkle build-up
  process.stdout.write("\n");
  for (let i = 0; i < GACHA_FRAMES.length; i++) {
    process.stdout.write(`\r  ${chalk.yellow(GACHA_FRAMES[i]!)}`);
    await sleep(100);
  }

  // Phase 3: Reveal animation
  process.stdout.write("\n\n");
  for (let i = 0; i < REVEAL_FRAMES.length; i++) {
    const frame = REVEAL_FRAMES[i]!;
    const coloredFrame = i < 4 ? chalk.white(frame) : color(frame);
    process.stdout.write(`\r  ${coloredFrame}`);
    await sleep(120);
  }

  // Phase 4: Final reveal with tier color
  const tierText = ` ${tier.toUpperCase()} `;
  process.stdout.write(`\r  ${color(">>>")} ${color.bold(tierText)} ${color("<<<")}`);
  await sleep(300);
  
  console.log("\n");
}

/** Display quick gacha animation for batch pulls */
export async function displayQuickAnimation(count: number): Promise<void> {
  const spinner = ora({
    text: chalk.cyan(`Summoning ${count} creatures...`),
    spinner: "dots12",
    color: "cyan",
  }).start();

  await sleep(400 + count * 50);
  spinner.succeed(chalk.green(`Summoned ${count} creatures!`));
}

/** Display batch pull results */
export function displayBatchResults(
  pets: PixelPet[],
  targetTier: Tier | null,
  found: boolean
): void {
  console.log();
  console.log(chalk.bold(`  Summon Results (${pets.length} total)`));
  console.log(chalk.gray("  " + "-".repeat(45)));

  // Count by tier
  const tierCounts: Record<Tier, number> = {
    bronze: 0, silver: 0, gold: 0, platinum: 0, diamond: 0, mythic: 0,
  };
  let sparkleCount = 0;

  for (const pet of pets) {
    tierCounts[pet.tier]++;
    if (pet.sparkle) sparkleCount++;
  }

  // Show tier breakdown
  for (const tier of TIERS) {
    if (tierCounts[tier] > 0) {
      const color = TIER_COLORS[tier];
      const symbol = TIER_SYMBOLS[tier];
      const isTarget = tier === targetTier;
      const marker = isTarget ? chalk.green(" <-- TARGET") : "";
      console.log(
        `  ${color(symbol)} ${tier.padEnd(10)} x${tierCounts[tier]}${marker}`
      );
    }
  }

  if (sparkleCount > 0) {
    console.log(chalk.yellow(`  * Sparkle pets: ${sparkleCount}`));
  }

  console.log(chalk.gray("  " + "-".repeat(45)));

  if (targetTier) {
    if (found) {
      console.log(chalk.green(`  Target ${targetTier.toUpperCase()} reached!`));
    } else {
      console.log(chalk.yellow(`  Target ${targetTier.toUpperCase()} not reached.`));
    }
  }

  console.log();
}

/** Display pet list */
export function displayPetList(pets: PixelPet[]): void {
  if (pets.length === 0) {
    console.log(chalk.yellow("\n  No pets in collection yet!"));
    console.log(chalk.gray("  Use 'pull' to summon your first pet.\n"));
    return;
  }

  console.log(chalk.bold(`\n  Collection (${pets.length} pets)\n`));
  console.log(chalk.gray("  " + "-".repeat(50)));

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
  const initialSprite = renderSprite(pet, 0);
  const frameCount = getFrameCount(pet.species);
  const startTime = Date.now();
  let frame = 0;

  console.log();
  for (const line of initialSprite) {
    console.log(TIER_COLORS[pet.tier](`  ${line}`));
  }

  while (Date.now() - startTime < duration) {
    const sprite = renderSprite(pet, frame);
    const color = TIER_COLORS[pet.tier];

    process.stdout.write(`\x1B[${sprite.length}A`);

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
export function displayHelp(cliName = "pixel-pets-cli"): void {
  const directName = cliName === "pixel-pets-cli" ? "pixel-pets" : cliName;

  console.log(`
  ${chalk.bold("Pixel Pets CLI")} - Terminal Pet Collection Game

  ${chalk.bold("Quick Start:")}
    ${chalk.cyan("npx pixel-pets-cli")}          Run directly without install
    ${chalk.cyan("npx pixel-pets-cli pull")}     Summon a pet instantly

  ${chalk.bold("Commands:")}
    pull [seed]              Summon a new pet
    pull -n <count>          Summon multiple pets
    pull -u <tier>           Summon until reaching tier (b/s/g/p/d/m)
    pull -n 100 -u gold      Summon up to 100 or until gold
    list                     Show your pet collection
    show <name>              Display detailed pet card
    animate <name>           Watch pet animation
    stats                    Show collection statistics
    rates                    Display summon rates
    clear --confirm          Clear all pets
    help                     Show this help

  ${chalk.bold("Tier Shortcuts:")}
    b = bronze, s = silver, g = gold
    p = platinum, d = diamond, m = mythic

  ${chalk.bold("Examples:")}
    ${chalk.gray("# Summon 10 pets")}
    ${directName} pull -n 10

    ${chalk.gray("# Summon until getting a gold or higher")}
    ${directName} pull -u g

    ${chalk.gray("# Summon up to 50 times or until diamond")}
    ${directName} pull -n 50 -u d
`);
}

/** Display rates */
export function displayRates(): void {
  console.log(chalk.bold("\n  Summon Rates\n"));
  console.log(chalk.gray("  " + "-".repeat(45)));

  for (const tier of TIERS) {
    const color = TIER_COLORS[tier];
    const symbol = TIER_SYMBOLS[tier];
    const prob = getTierProbability(tier).toFixed(1).padStart(5);
    const sparkle = getSparkleProbability(tier).toFixed(2).padStart(5);

    console.log(
      `  ${color(symbol)} ${tier.padEnd(10)} ${prob}%  (sparkle: ${sparkle}%)`
    );
  }

  console.log(chalk.gray("  " + "-".repeat(45)));
  console.log(chalk.gray("\n  Sparkle chance increases with tier.\n"));
}

/** Display collection stats */
export function displayStats(pets: PixelPet[]): void {
  console.log(chalk.bold("\n  Collection Statistics\n"));

  if (pets.length === 0) {
    console.log(chalk.yellow("  No pets collected yet.\n"));
    return;
  }

  const tierCounts: Record<Tier, number> = {
    bronze: 0, silver: 0, gold: 0, platinum: 0, diamond: 0, mythic: 0,
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

  for (const tier of TIERS) {
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

/** Display welcome banner */
export function displayBanner(): void {
  console.log();
  console.log(chalk.cyan("  ____  _          _   ____      _       "));
  console.log(chalk.cyan(" |  _ \\(_)_  _____| | |  _ \\ ___| |_ ___ "));
  console.log(chalk.cyan(" | |_) | \\ \\/ / _ \\ | | |_) / _ \\ __/ __|"));
  console.log(chalk.cyan(" |  __/| |>  <  __/ | |  __/  __/ |_\\__ \\"));
  console.log(chalk.cyan(" |_|   |_/_/\\_\\___|_| |_|   \\___|\\__|___/"));
  console.log();
  console.log(chalk.gray("  Terminal Pet Collection Game"));
  console.log(chalk.gray("  Run: npx pixel-pets-cli pull"));
  console.log();
}
