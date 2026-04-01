/** Terminal rendering and animation helpers. */

import chalk from "chalk";
import ora from "ora";
import stringWidth from "string-width";
import type { Attribute, PixelPet, Tier } from "./types.js";
import { ATTRIBUTES, TIERS, TIER_RANK, TIER_SYMBOLS } from "./types.js";
import { renderFace, renderSprite, getFrameCount, SPARKLE_FRAMES } from "./sprites.js";
import { getTierProbability, getSparkleProbability } from "./gacha.js";

const TIER_COLORS: Record<Tier, typeof chalk> = {
  bronze: chalk.hex("#CD7F32"),
  silver: chalk.hex("#C0C0C0"),
  gold: chalk.hex("#FFD700"),
  platinum: chalk.hex("#E5E4E2"),
  diamond: chalk.hex("#B9F2FF"),
  mythic: chalk.hex("#FF00FF"),
};

const PORTAL_FRAMES = [
  "   .      .   ",
  " .  * .. *  . ",
  ".. <*>  <*> ..",
  " .  * .. *  . ",
];

const REEL_FRAMES = [
  "[.        ]",
  "[..       ]",
  "[...      ]",
  "[....     ]",
  "[.....    ]",
  "[......   ]",
  "[.......  ]",
  "[........ ]",
  "[.........]",
];

export interface BatchRevealConfig {
  frameDelay: number;
  portalDelay: number;
  reelDelay: number;
}

function isInteractiveTerminal(): boolean {
  return Boolean(process.stdout.isTTY);
}

function renderBar(value: number, width = 12): string {
  const filled = Math.round((value / 100) * width);
  return chalk.green("=".repeat(filled)) + chalk.gray("-".repeat(width - filled));
}

function getCardInnerWidth(): number {
  if (!process.stdout.isTTY || !process.stdout.columns) {
    return 42;
  }

  return Math.max(42, Math.min(58, process.stdout.columns - 4));
}

function padVisible(text: string, width: number): string {
  return text + " ".repeat(Math.max(0, width - stringWidth(text)));
}

function renderCardRow(color: typeof chalk, innerWidth: number, content: string): string {
  return color("|") + padVisible(content, innerWidth) + color("|");
}

function wrapText(text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (stringWidth(next) <= maxWidth) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

function formatAttribute(name: Attribute, value: number): string {
  return `${name.padEnd(10)} ${renderBar(value)} ${value.toString().padStart(3)}`;
}

function getBatchRevealConfig(count: number): BatchRevealConfig {
  if (count <= 8) {
    return { frameDelay: 70, portalDelay: 90, reelDelay: 70 };
  }

  if (count <= 24) {
    return { frameDelay: 45, portalDelay: 60, reelDelay: 45 };
  }

  return { frameDelay: 22, portalDelay: 34, reelDelay: 26 };
}

function renderProgressBar(current: number, total: number, width = 18): string {
  const filled = Math.max(1, Math.round((current / total) * width));
  return `[${"=".repeat(filled)}${" ".repeat(width - filled)}]`;
}

function getBestTier(pets: PixelPet[]): Tier {
  return pets.reduce((best, current) =>
    TIER_RANK[current.tier] > TIER_RANK[best] ? current.tier : best
  , pets[0]!.tier);
}

export function displayPetCard(pet: PixelPet): void {
  const color = TIER_COLORS[pet.tier];
  const probability = getTierProbability(pet.tier).toFixed(1);
  const innerWidth = getCardInnerWidth();
  const border = color("+" + "-".repeat(innerWidth) + "+");

  console.log();
  console.log(border);

  const sparkleTag = pet.sparkle ? " * SPARKLE *" : "";
  console.log(renderCardRow(color, innerWidth, chalk.bold.white(` ${pet.nickname}${sparkleTag}`)));
  console.log(renderCardRow(color, innerWidth, color(` ${TIER_SYMBOLS[pet.tier]} ${pet.tier.toUpperCase()} (${probability}%)`)));
  console.log(border);
  console.log(renderCardRow(
    color,
    innerWidth,
    chalk.white(`  Species: ${pet.species.padEnd(12)} Face: ${renderFace(pet)}`)
  ));
  console.log(renderCardRow(
    color,
    innerWidth,
    chalk.white(`  Expression: ${pet.expression}  Accessory: ${pet.accessory}`)
  ));

  console.log(border);
  console.log(renderCardRow(color, innerWidth, chalk.bold.white("  ATTRIBUTES")));
  for (const attribute of ATTRIBUTES) {
    console.log(renderCardRow(color, innerWidth, `  ${formatAttribute(attribute, pet.attributes[attribute])}`));
  }

  console.log(border);
  console.log(renderCardRow(color, innerWidth, chalk.bold.white("  SPRITE")));
  for (const line of renderSprite(pet, 0)) {
    const spriteLine = pet.sparkle ? `  ${line} *` : `  ${line}`;
    console.log(renderCardRow(color, innerWidth, spriteLine));
  }

  console.log(border);
  wrapText(pet.trait, innerWidth - 6).forEach((line, index, lines) => {
    const prefix = index === 0 ? '  "' : "   ";
    const suffix = index === lines.length - 1 ? '"' : "";
    console.log(renderCardRow(color, innerWidth, chalk.gray(`${prefix}${line}${suffix}`)));
  });

  console.log(border);
  console.log();
}

export async function displaySingleSummonAnimation(pet: PixelPet): Promise<void> {
  if (!isInteractiveTerminal()) {
    console.log(chalk.cyan("\n  Summoning pet...\n"));
    return;
  }

  const spinner = ora({
    text: chalk.cyan("Aligning summon field..."),
    spinner: "dots",
    color: "cyan",
  }).start();

  await sleep(420);
  spinner.text = chalk.cyan("Tracing creature silhouette...");
  await sleep(420);
  spinner.text = chalk.yellow("Locking reveal frame...");
  spinner.color = "yellow";
  await sleep(420);
  spinner.stop();

  await playRevealSequence(pet, { portalDelay: 90, reelDelay: 70 });
}

export async function displayBatchSummonAnimation(count: number): Promise<BatchRevealConfig> {
  const config = getBatchRevealConfig(count);

  if (!isInteractiveTerminal()) {
    console.log(chalk.cyan(`\n  Summoning ${count} pets...\n`));
    return config;
  }

  const spinner = ora({
    text: chalk.cyan(`Opening multi-summon gallery for ${count} pets...`),
    spinner: "dots12",
    color: "cyan",
  }).start();

  await sleep(Math.min(900, 260 + count * 18));
  spinner.stop();

  const totalFrames = Math.min(12, Math.max(5, Math.ceil(count / 2)));
  for (let index = 0; index < totalFrames; index++) {
    const progress = renderProgressBar(index + 1, totalFrames);
    const portal = PORTAL_FRAMES[index % PORTAL_FRAMES.length]!;
    process.stdout.write(`\r  ${chalk.gray(progress)} ${chalk.cyan(portal)}`);
    await sleep(config.frameDelay * 2);
  }

  console.log(`\n  ${chalk.green(`Gallery ready: ${count} reveals`)}\n`);
  return config;
}

export async function displayBatchPetReveal(
  pet: PixelPet,
  index: number,
  total: number,
  config: BatchRevealConfig
): Promise<void> {
  const label = `${(index + 1).toString().padStart(String(total).length, "0")}/${total}`;
  console.log(chalk.bold(`  Reveal ${label}`));
  await playRevealSequence(pet, config);
  displayPetCard(pet);
}

export function displaySummonSummary(pets: PixelPet[], bestPet: PixelPet): void {
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

  console.log(chalk.bold(`  Summon Summary (${pets.length} pets)`));
  console.log(chalk.gray("  " + "-".repeat(45)));

  for (const tier of TIERS) {
    if (tierCounts[tier] > 0) {
      console.log(`  ${TIER_COLORS[tier](TIER_SYMBOLS[tier])} ${tier.padEnd(10)} x${tierCounts[tier]}`);
    }
  }

  console.log(chalk.gray("  " + "-".repeat(45)));
  console.log(`  Best Tier: ${TIER_COLORS[getBestTier(pets)](getBestTier(pets).toUpperCase())}`);
  console.log(`  Sparkle Pets: ${chalk.bold(sparkleCount.toString())}`);
  console.log();
  console.log(chalk.bold("  Featured Pull"));
  displayPetCard(bestPet);
}

export function displayPetList(pets: PixelPet[]): void {
  if (pets.length === 0) {
    console.log(chalk.yellow("\n  No pets in collection yet!"));
    console.log(chalk.gray("  Use 'pull' to summon your first pet.\n"));
    return;
  }

  console.log(chalk.bold(`\n  Collection (${pets.length} pets)\n`));
  console.log(chalk.gray("  " + "-".repeat(50)));

  pets.forEach((pet, index) => {
    const sparkle = pet.sparkle ? chalk.yellow(" *") : "";
    console.log(
      chalk.gray(`  #${(index + 1).toString().padStart(3)}`) +
      ` ${TIER_COLORS[pet.tier](TIER_SYMBOLS[pet.tier])} ` +
      chalk.white(pet.nickname.padEnd(18)) +
      ` ${renderFace(pet)}${sparkle}`
    );
  });

  console.log(chalk.gray("  " + "-".repeat(50)) + "\n");
}

export async function displayAnimatedSprite(pet: PixelPet, duration = 3000): Promise<void> {
  const initialSprite = renderSprite(pet, 0);
  const frameCount = getFrameCount(pet.species);
  const startTime = Date.now();
  let frame = 0;

  console.log();
  initialSprite.forEach((line) => {
    console.log(TIER_COLORS[pet.tier](`  ${line}`));
  });

  while (Date.now() - startTime < duration) {
    const sprite = renderSprite(pet, frame);
    process.stdout.write(`\x1B[${sprite.length}A`);

    for (const line of sprite) {
      const sparkle = pet.sparkle ? ` ${SPARKLE_FRAMES[frame % SPARKLE_FRAMES.length]}` : "";
      console.log(TIER_COLORS[pet.tier](`  ${line}${sparkle}`));
    }

    frame = (frame + 1) % frameCount;
    await sleep(400);
  }

  console.log();
}

export function displayHelp(cliName = "pixel-pets-cli"): void {
  const directName = cliName === "pixel-pets-cli" ? "pixel-pets" : cliName;

  console.log(`
  ${chalk.bold("Pixel Pets CLI")} - Terminal Pet Collection Game

  ${chalk.bold("Quick Start:")}
    ${chalk.cyan("npx pixel-pets-cli")}          Run directly without install
    ${chalk.cyan("npx pixel-pets-cli pull")}     Summon a pet instantly
    ${chalk.cyan("npx pixel-pets-cli pull -n 10")}  Run a gallery-style multi-summon

  ${chalk.bold("Commands:")}
    pull [seed]              Summon a new pet
    pull -n <count>          Summon multiple pets with staged reveals
    list                     Show your pet collection
    show <name>              Display a detailed pet card
    animate <name>           Watch a pet animation
    stats                    Show collection statistics
    rates                    Display summon rates
    clear --confirm          Clear all pets
    help                     Show this help

  ${chalk.bold("Examples:")}
    ${chalk.gray("# Summon 10 pets")}
    ${directName} pull -n 10

    ${chalk.gray("# Summon 50 pets with a repeatable seed")}
    ${directName} pull gallery-seed -n 50

    ${chalk.gray("# Summon 100 pets with fast gallery reveals")}
    ${directName} pull -n 100
`);
}

export function displayRates(): void {
  console.log(chalk.bold("\n  Summon Rates\n"));
  console.log(chalk.gray("  " + "-".repeat(45)));

  for (const tier of TIERS) {
    console.log(
      `  ${TIER_COLORS[tier](TIER_SYMBOLS[tier])} ${tier.padEnd(10)} ${getTierProbability(tier).toFixed(1).padStart(5)}%  (sparkle: ${getSparkleProbability(tier).toFixed(2).padStart(5)}%)`
    );
  }

  console.log(chalk.gray("  " + "-".repeat(45)));
  console.log(chalk.gray("\n  All pulls remain probability-based.\n"));
}

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

  for (const tier of TIERS) {
    if (tierCounts[tier] > 0) {
      console.log(`  ${TIER_COLORS[tier](TIER_SYMBOLS[tier])} ${tier.padEnd(10)} ${tierCounts[tier]}`);
    }
  }

  console.log(chalk.gray("  " + "-".repeat(30)) + "\n");
}

export function displayBanner(): void {
  console.log();
  console.log(chalk.cyan("  ___ _         _   ___     _      ___ ___ ___ "));
  console.log(chalk.cyan(" | _ (_)_ _____| | | _ \\___| |_   / __| | |_ _|"));
  console.log(chalk.cyan(" |  _/ \\ \\/ / -_) | |  _/ -_)  _| | (__| | || | "));
  console.log(chalk.cyan(" |_| |_/_/\\_\\___|_| |_| \\___|\\__|  \\___|_|_|___|"));
  console.log();
  console.log(chalk.gray("  Collect cute ASCII companions!"));
  console.log(chalk.gray("  Run: npx pixel-pets-cli pull"));
  console.log();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function playRevealSequence(
  pet: PixelPet,
  config: Pick<BatchRevealConfig, "portalDelay" | "reelDelay">
): Promise<void> {
  const color = TIER_COLORS[pet.tier];

  process.stdout.write("\n");
  for (const frame of PORTAL_FRAMES) {
    process.stdout.write(`\r  ${chalk.yellow(frame)}`);
    await sleep(config.portalDelay);
  }

  process.stdout.write("\n");
  for (const frame of REEL_FRAMES) {
    process.stdout.write(`\r  ${chalk.white(frame)} ${color(TIER_SYMBOLS[pet.tier])}`);
    await sleep(config.reelDelay);
  }

  process.stdout.write(`\r  ${color(">>>")} ${color.bold(` ${pet.tier.toUpperCase()} `)} ${color("<<<")}`);
  await sleep(Math.max(160, config.reelDelay * 3));
  console.log("\n");
}
