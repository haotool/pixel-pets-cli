#!/usr/bin/env node

/** CLI entry point. */

import { Command, Option } from "commander";
import chalk from "chalk";
import path from "node:path";
import { createRequire } from "node:module";
import type { PixelPet } from "./types.js";
import { TIER_RANK } from "./types.js";
import { roll, createSeed } from "./gacha.js";
import { generateNickname, generateTrait } from "./names.js";
import { loadPets, addPet, findPetByNickname, clearPets } from "./storage.js";
import {
  displayPetCard,
  displaySingleSummonAnimation,
  displayBatchSummonAnimation,
  displayBatchPetReveal,
  displaySummonSummary,
  displayPetList,
  displayAnimatedSprite,
  displayHelp,
  displayRates,
  displayStats,
  displayBanner,
} from "./display.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

const program = new Command();
const cliName = getCliName();

function getCliName(): string {
  const invokedAs = process.argv[1] ? path.basename(process.argv[1]) : "";
  return invokedAs && !/^index\.[cm]?[jt]s$/.test(invokedAs)
    ? invokedAs
    : "pixel-pets-cli";
}

function createPet(seed: string): PixelPet {
  const { core, identitySeed } = roll(seed);

  return {
    ...core,
    nickname: generateNickname(core.species, identitySeed),
    trait: generateTrait(identitySeed),
    obtainedAt: Date.now(),
    seedHash: seed,
  };
}

function createSeedSequence(count: number, baseSeed?: string): string[] {
  return Array.from({ length: count }, (_, index) =>
    baseSeed ? `${baseSeed}:${index + 1}` : createSeed()
  );
}

function getBestPet(pets: PixelPet[]): PixelPet {
  return pets.reduce((best, current) =>
    TIER_RANK[current.tier] > TIER_RANK[best.tier] ? current : best
  );
}

async function pullSinglePet(seedInput?: string): Promise<PixelPet> {
  const seed = seedInput || createSeed();
  const pet = createPet(seed);

  await displaySingleSummonAnimation(pet);
  addPet(pet);
  displayPetCard(pet);

  console.log(chalk.green("  Added to collection!\n"));
  return pet;
}

async function pullMultiplePets(count: number, seedInput?: string): Promise<void> {
  const total = Math.max(1, count);
  const seeds = createSeedSequence(total, seedInput);
  const pets = seeds.map((seed) => createPet(seed));
  const revealConfig = await displayBatchSummonAnimation(total);

  pets.forEach((pet) => addPet(pet));

  for (const [index, pet] of pets.entries()) {
    await displayBatchPetReveal(pet, index, total, revealConfig);
  }

  displaySummonSummary(pets, getBestPet(pets));
}

function showPet(name: string): void {
  const pet = findPetByNickname(name);
  if (!pet) {
    console.log(chalk.red(`\n  Pet "${name}" not found.\n`));
    return;
  }

  displayPetCard(pet);
}

async function animatePet(name: string): Promise<void> {
  const pet = findPetByNickname(name);
  if (!pet) {
    console.log(chalk.red(`\n  Pet "${name}" not found.\n`));
    return;
  }

  console.log(chalk.bold(`\n  Watching ${pet.nickname}...\n`));
  await displayAnimatedSprite(pet, 3000);
}

function clearCollection(confirm: boolean): void {
  if (!confirm) {
    console.log(chalk.yellow("\n  Use --confirm flag to clear collection.\n"));
    return;
  }

  clearPets();
  console.log(chalk.green("\n  Collection cleared.\n"));
}

program
  .name(cliName)
  .description("Terminal pet collection game - summon and collect pixel companions")
  .version(version);

program
  .command("pull [seed]")
  .description("Summon one or more pets with probability-based reveals")
  .option("-n, --count <number>", "Number of pets to summon", "1")
  .addOption(
    new Option("-u, --until <tier>", "Deprecated tier target option")
      .hideHelp()
  )
  .action(async (seed: string | undefined, options: { count: string; until?: string }) => {
    const count = Number.parseInt(options.count, 10);

    if (options.until) {
      console.log(chalk.yellow("\n  Tier targeting has been removed.\n"));
      console.log(chalk.gray("  Pixel Pets now keeps every summon fully probability-based."));
      console.log(chalk.gray("  Use `pull -n <count>` to run a pure random multi-summon.\n"));
      return;
    }

    if (!Number.isInteger(count) || count < 1) {
      console.log(chalk.red("\n  Count must be a positive integer.\n"));
      return;
    }

    if (count === 1) {
      await pullSinglePet(seed);
      return;
    }

    await pullMultiplePets(count, seed);
  });

program
  .command("list")
  .description("Show your pet collection")
  .action(() => {
    displayPetList(loadPets());
  });

program
  .command("show <name>")
  .description("Display a detailed pet card")
  .action((name: string) => {
    showPet(name);
  });

program
  .command("animate <name>")
  .description("Watch a pet animation")
  .action(async (name: string) => {
    await animatePet(name);
  });

program
  .command("stats")
  .description("Show collection statistics")
  .action(() => {
    displayStats(loadPets());
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
    displayHelp(cliName);
  });

if (process.argv.length <= 2) {
  displayBanner();
  displayHelp(cliName);
} else {
  program.parse();
}
