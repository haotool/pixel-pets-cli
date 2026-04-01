#!/usr/bin/env node

/**
 * Pixel Pets CLI - Main Entry Point
 * 
 * An ORIGINAL terminal pet collection game.
 * 
 * Quick Start:
 *   npx pixel-pets-cli
 *   npx pixel-pets-cli pull
 *   npx pixel-pets-cli pull -n 10 -u gold
 */

import { Command } from "commander";
import chalk from "chalk";
import type { PixelPet, Tier } from "./types.js";
import { roll, createSeed } from "./gacha.js";
import { generateNickname, generateTrait } from "./names.js";
import { loadPets, addPet, findPetByNickname, clearPets } from "./storage.js";
import {
  displayPetCard,
  displayPetSummary,
  displayGachaAnimation,
  displayQuickAnimation,
  displayBatchResults,
  displayPetList,
  displayAnimatedSprite,
  displayHelp,
  displayRates,
  displayStats,
  displayBanner,
  tierMeetsTarget,
  parseTier,
} from "./display.js";

const program = new Command();

/** Pull a single pet with animation */
async function pullSinglePet(seedInput?: string): Promise<PixelPet> {
  const seed = seedInput || createSeed();
  const { core, identitySeed } = roll(seed);

  await displayGachaAnimation(core.tier);

  const pet: PixelPet = {
    ...core,
    nickname: generateNickname(core.species, identitySeed),
    trait: generateTrait(identitySeed),
    obtainedAt: Date.now(),
    seedHash: seed,
  };

  addPet(pet);
  displayPetCard(pet);

  console.log(chalk.green(`  Added to collection!\n`));
  return pet;
}

/** Pull multiple pets */
async function pullMultiplePets(
  count: number,
  untilTier: Tier | null
): Promise<void> {
  const pets: PixelPet[] = [];
  let targetReached = false;
  const maxPulls = count || 1000;

  console.log();

  if (untilTier) {
    console.log(
      chalk.cyan(`  Summoning until ${untilTier.toUpperCase()} (max ${maxPulls})...\n`)
    );
  } else {
    console.log(chalk.cyan(`  Summoning ${maxPulls} pets...\n`));
  }

  await displayQuickAnimation(Math.min(maxPulls, 10));

  for (let i = 0; i < maxPulls; i++) {
    const seed = createSeed();
    const { core, identitySeed } = roll(seed);

    const pet: PixelPet = {
      ...core,
      nickname: generateNickname(core.species, identitySeed),
      trait: generateTrait(identitySeed),
      obtainedAt: Date.now(),
      seedHash: seed,
    };

    pets.push(pet);
    addPet(pet);

    // Show progress every 10 pulls
    if ((i + 1) % 10 === 0) {
      process.stdout.write(
        `\r  Progress: ${chalk.cyan((i + 1).toString())} pulls...`
      );
    }

    // Check if target tier reached
    if (untilTier && tierMeetsTarget(core.tier, untilTier)) {
      targetReached = true;
      break;
    }
  }

  console.log(`\r  Progress: ${chalk.green(pets.length.toString())} pulls completed!`);

  // Display batch results
  displayBatchResults(pets, untilTier, targetReached);

  // Show the best pet obtained
  const bestPet = pets.reduce((best, current) => {
    const bestIdx = ["bronze", "silver", "gold", "platinum", "diamond", "mythic"].indexOf(best.tier);
    const currIdx = ["bronze", "silver", "gold", "platinum", "diamond", "mythic"].indexOf(current.tier);
    return currIdx > bestIdx ? current : best;
  });

  console.log(chalk.bold("  Best Pet Obtained:"));
  displayPetCard(bestPet, true);

  // If target was reached, show the target pet
  if (targetReached && untilTier) {
    const targetPet = pets.find((p) => tierMeetsTarget(p.tier, untilTier));
    if (targetPet && targetPet !== bestPet) {
      console.log(chalk.bold("  Target Pet:"));
      displayPetCard(targetPet, true);
    }
  }
}

/** Show specific pet */
function showPet(name: string): void {
  const pet = findPetByNickname(name);
  if (!pet) {
    console.log(chalk.red(`\n  Pet "${name}" not found.\n`));
    return;
  }
  displayPetCard(pet);
}

/** Animate specific pet */
async function animatePet(name: string): Promise<void> {
  const pet = findPetByNickname(name);
  if (!pet) {
    console.log(chalk.red(`\n  Pet "${name}" not found.\n`));
    return;
  }
  console.log(chalk.bold(`\n  Watching ${pet.nickname}...\n`));
  await displayAnimatedSprite(pet, 3000);
}

/** Clear collection with confirmation */
function clearCollection(confirm: boolean): void {
  if (!confirm) {
    console.log(chalk.yellow("\n  Use --confirm flag to clear collection.\n"));
    return;
  }
  clearPets();
  console.log(chalk.green("\n  Collection cleared.\n"));
}

// Setup CLI
program
  .name("pixel-pets")
  .description("Terminal pet collection game - summon and collect pixel companions")
  .version("1.1.0");

program
  .command("pull [seed]")
  .description("Summon new pet(s)")
  .option("-n, --count <number>", "Number of pets to summon", "1")
  .option("-u, --until <tier>", "Summon until reaching tier (b/s/g/p/d/m)")
  .action(async (seed: string | undefined, options: { count: string; until?: string }) => {
    const count = parseInt(options.count, 10);
    const untilTier = options.until ? parseTier(options.until) : null;

    if (options.until && !untilTier) {
      console.log(chalk.red("\n  Invalid tier. Use: b, s, g, p, d, or m\n"));
      console.log(chalk.gray("  b=bronze, s=silver, g=gold, p=platinum, d=diamond, m=mythic\n"));
      return;
    }

    if (count > 1 || untilTier) {
      await pullMultiplePets(count, untilTier);
    } else {
      await pullSinglePet(seed);
    }
  });

program
  .command("list")
  .description("Show your pet collection")
  .action(() => {
    const pets = loadPets();
    displayPetList(pets);
  });

program
  .command("show <name>")
  .description("Display detailed pet card")
  .action((name: string) => {
    showPet(name);
  });

program
  .command("animate <name>")
  .description("Watch pet animation")
  .action(async (name: string) => {
    await animatePet(name);
  });

program
  .command("stats")
  .description("Show collection statistics")
  .action(() => {
    const pets = loadPets();
    displayStats(pets);
  });

program
  .command("rates")
  .description("Display summon rates")
  .action(() => {
    displayRates();
  });

program
  .command("clear")
  .description("Clear all pets")
  .option("--confirm", "Confirm deletion")
  .action((options: { confirm?: boolean }) => {
    clearCollection(options.confirm ?? false);
  });

program
  .command("help")
  .description("Show help information")
  .action(() => {
    displayHelp();
  });

// Default action - show banner and help
if (process.argv.length <= 2) {
  displayBanner();
  displayHelp();
} else {
  program.parse();
}
