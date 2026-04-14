import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  loadPets,
  savePets,
  addPet,
  findPetByNickname,
  clearPets,
  getStoragePath,
} from "./storage.js";
import type { PixelPet } from "./types.js";

function createTempStorageDir(): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "pixel-pets-test-"));
  return path.join(tempDir, ".pixel-pets");
}

function createTestPet(overrides: Partial<PixelPet> = {}): PixelPet {
  return {
    tier: "gold",
    species: "slimeling",
    expression: "^",
    accessory: "none",
    sparkle: false,
    attributes: {
      VITALITY: 50,
      AGILITY: 50,
      SPIRIT: 50,
      LUCK: 50,
      CHARM: 50,
      FOCUS: 50,
    },
    nickname: "Test Pet",
    trait: "Test trait",
    obtainedAt: Date.now(),
    seedHash: "test-seed",
    ...overrides,
  };
}

test("getStoragePath returns expected path", () => {
  const storagePath = getStoragePath();
  assert.ok(storagePath.endsWith(".pixel-pets/collection.json"));
});

test("loadPets returns array", () => {
  const pets = loadPets();
  assert.ok(Array.isArray(pets));
});

test("findPetByNickname returns pet or undefined", () => {
  const pets = loadPets();
  if (pets.length > 0) {
    const found = findPetByNickname(pets[0]!.nickname);
    assert.ok(found !== undefined);
  }
  const notFound = findPetByNickname("NonExistentPetName12345");
  assert.equal(notFound, undefined);
});
