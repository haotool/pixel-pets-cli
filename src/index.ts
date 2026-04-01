#!/usr/bin/env node

/**
 * Pixel Pets CLI - Main Entry Point
 * 
 * An ORIGINAL terminal pet collection game.
 * All code, designs, and mechanics are original creations.
 */

import { Command } from "commander";
import chalk from "chalk";
import figlet from "figlet";
import type { PixelPet } from "./types.js";
import { roll, createSeed } from "./gacha.js";
import { generateNickname, generateTrait } from "./names.js";
import { loadPets, addPet, findPetByNickname, clearPets } from "./storage.js";
import {
  displayPetCard,
  displayGachaAnimation,
  displayPetList,
  displayAnimatedSprite,
  displayHelp,
  displayRates,
  displayStats,
} from "./display.js";

const program = new Command();

/** Show banner */
function showBanner(): void {
  console.log(
    chalk.cyan(
      figlet.textSync("Pixel Pets", {
        font: "Small",
        horizontalLayout: "default",
      })
    )
  );
  console.log(chalk.gray("  Terminal Pet Collection Game\n"));
}

/** Pull a new pet */
async function pullPet(seedInput?: string): Promise<void> {
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
  .version("1.0.0");

program
  .command("pull [seed]")
  .description("Summon a new pet")
  .action(async (seed?: string) => {
    await pullPet(seed);
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

// Default action
if (process.argv.length <= 2) {
  showBanner();
  displayHelp();
} else {
  program.parse();
}
