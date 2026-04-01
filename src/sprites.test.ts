import test from "node:test";
import assert from "node:assert/strict";
import { renderSprite } from "./sprites.js";
import type { PixelPet } from "./types.js";

const basePet: PixelPet = {
  tier: "gold",
  species: "frostwhisk",
  expression: "w",
  accessory: "none",
  sparkle: false,
  attributes: {
    VITALITY: 10,
    AGILITY: 10,
    SPIRIT: 10,
    LUCK: 10,
    CHARM: 10,
    FOCUS: 10,
  },
  nickname: "Test Pet",
  trait: "Testing sprite output",
  obtainedAt: 0,
  seedHash: "test-seed",
};

test("renderSprite keeps four body lines when no accessory is equipped", () => {
  const sprite = renderSprite(basePet, 0);
  assert.equal(sprite.length, 4);
});

test("renderSprite prepends accessory line when accessory is equipped", () => {
  const sprite = renderSprite({ ...basePet, accessory: "ribbon" }, 0);
  assert.equal(sprite.length, 5);
  assert.equal(sprite[0], "    ~    ");
  assert.match(sprite[1]!, /\/\\_\/\\/);
});
