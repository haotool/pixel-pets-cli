import test from "node:test";
import assert from "node:assert/strict";
import stringWidth from "string-width";
import { displayPetCard } from "./display.js";
import type { PixelPet } from "./types.js";

const pet: PixelPet = {
  tier: "mythic",
  species: "thornback",
  expression: "w",
  accessory: "bell",
  sparkle: false,
  attributes: {
    VITALITY: 91,
    AGILITY: 75,
    SPIRIT: 94,
    LUCK: 95,
    CHARM: 58,
    FOCUS: 84,
  },
  nickname: "Shadow Vine",
  trait: "Has a habit of talking to plants",
  obtainedAt: 0,
  seedHash: "seed-4",
};

test("displayPetCard keeps borders aligned for styled attribute rows", () => {
  const originalWrite = process.stdout.write.bind(process.stdout);
  let output = "";

  process.stdout.write = ((chunk: string | Uint8Array) => {
    output += typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8");
    return true;
  }) as typeof process.stdout.write;

  try {
    displayPetCard(pet);
  } finally {
    process.stdout.write = originalWrite;
  }

  const lines = output
    .split("\n")
    .filter((line) => line.startsWith("+") || line.startsWith("|"));

  const borderWidth = stringWidth(lines[0]!);
  assert.ok(borderWidth > 0);

  for (const line of lines) {
    assert.equal(stringWidth(line), borderWidth);
  }
});
