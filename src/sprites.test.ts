import test from "node:test";
import assert from "node:assert/strict";
import {
  renderSprite,
  renderFace,
  getFrameCount,
  validateSpriteDimensions,
  getSpriteValidationErrors,
} from "./sprites.js";
import type { Creature, PixelPet } from "./types.js";
import { CREATURES, SPRITE_HEIGHT, SPRITE_WIDTH } from "./types.js";

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

test("renderSprite returns 5 body lines when no accessory is equipped", () => {
  const sprite = renderSprite(basePet, 0);
  assert.equal(sprite.length, SPRITE_HEIGHT);
});

test("renderSprite prepends accessory line when accessory is equipped", () => {
  const sprite = renderSprite({ ...basePet, accessory: "ribbon" }, 0);
  assert.equal(sprite.length, SPRITE_HEIGHT + 1);
  assert.match(sprite[0]!, /~/);
});

test("all species have 3 animation frames", () => {
  for (const species of CREATURES) {
    assert.equal(getFrameCount(species), 3);
  }
});

test("blink frame (-1) replaces eyes with dash", () => {
  const sprite = renderSprite(basePet, -1);
  const hasBlinkEyes = sprite.some((line) => line.includes("-"));
  assert.equal(hasBlinkEyes, true);
});

test("all sprites have correct dimensions (5x12)", () => {
  assert.equal(validateSpriteDimensions(), true);
});

test("each species renders distinct silhouette", () => {
  const silhouettes = new Set<string>();
  for (const species of CREATURES) {
    const pet = { ...basePet, species };
    const sprite = renderSprite(pet, 0).join("\n");
    silhouettes.add(sprite);
  }
  assert.equal(silhouettes.size, CREATURES.length);
});

test("expression placeholder is replaced in all frames", () => {
  for (const species of CREATURES) {
    const pet = { ...basePet, species, expression: "^" as const };
    for (const frameId of [0, 1, 2] as const) {
      const sprite = renderSprite(pet, frameId);
      const hasPlaceholder = sprite.some((line) => line.includes("{E}"));
      assert.equal(hasPlaceholder, false, `${species} frame ${frameId} has unreplaced placeholder`);
    }
  }
});

test("each species has unique face pattern", () => {
  const faces = new Map<string, Creature>();
  for (const species of CREATURES) {
    const pet = { ...basePet, species, expression: "o" as const };
    const face = renderFace(pet);
    assert.ok(!faces.has(face), `${species} has duplicate face with ${faces.get(face)}: ${face}`);
    faces.set(face, species);
  }
  assert.equal(faces.size, CREATURES.length);
});

test("all rendered lines have exactly 12 characters", () => {
  for (const species of CREATURES) {
    const pet = { ...basePet, species };
    for (const frameId of [0, 1, 2, -1] as const) {
      const sprite = renderSprite(pet, frameId);
      for (let i = 0; i < sprite.length; i++) {
        const line = sprite[i]!;
        assert.equal(
          line.length,
          SPRITE_WIDTH,
          `${species} frame ${frameId} line ${i}: expected ${SPRITE_WIDTH} chars, got ${line.length}`
        );
      }
    }
  }
});

test("getSpriteValidationErrors returns empty array for valid sprites", () => {
  const errors = getSpriteValidationErrors();
  assert.equal(errors.length, 0, `Validation errors: ${errors.join(", ")}`);
});

test("animation frames show visual variation", () => {
  for (const species of CREATURES) {
    const pet = { ...basePet, species };
    const frame0 = renderSprite(pet, 0).join("\n");
    const frame1 = renderSprite(pet, 1).join("\n");
    const frame2 = renderSprite(pet, 2).join("\n");
    const hasVariation = frame0 !== frame1 || frame0 !== frame2 || frame1 !== frame2;
    assert.ok(hasVariation, `${species} should have visual variation between frames`);
  }
});
