import test from "node:test";
import assert from "node:assert/strict";
import { generateNickname, generateTrait } from "./names.js";
import { CREATURES } from "./types.js";

test("generateNickname produces deterministic output for same seed", () => {
  const name1 = generateNickname("slimeling", 12345);
  const name2 = generateNickname("slimeling", 12345);
  assert.equal(name1, name2);
});

test("generateNickname produces different output for different seeds", () => {
  const name1 = generateNickname("slimeling", 11111);
  const name2 = generateNickname("slimeling", 22222);
  assert.notEqual(name1, name2);
});

test("generateNickname produces different output for different species", () => {
  const name1 = generateNickname("slimeling", 12345);
  const name2 = generateNickname("fluffox", 12345);
  assert.notEqual(name1, name2);
});

test("generateNickname returns two-word format", () => {
  for (const species of CREATURES) {
    const name = generateNickname(species, Math.floor(Math.random() * 1e9));
    const words = name.split(" ");
    assert.equal(words.length, 2, `${species} nickname should be two words`);
  }
});

test("generateNickname uses species-specific suffixes", () => {
  const slimeNames = new Set<string>();
  const foxNames = new Set<string>();

  for (let i = 0; i < 50; i++) {
    slimeNames.add(generateNickname("slimeling", i).split(" ")[1]!);
    foxNames.add(generateNickname("fluffox", i).split(" ")[1]!);
  }

  const overlap = [...slimeNames].filter((s) => foxNames.has(s));
  assert.equal(overlap.length, 0, "Species should have distinct suffix pools");
});

test("generateTrait produces deterministic output for same seed", () => {
  const trait1 = generateTrait(12345);
  const trait2 = generateTrait(12345);
  assert.equal(trait1, trait2);
});

test("generateTrait produces different output for different seeds", () => {
  const trait1 = generateTrait(11111);
  const trait2 = generateTrait(22222);
  assert.notEqual(trait1, trait2);
});

test("generateTrait returns non-empty string", () => {
  for (let i = 0; i < 100; i++) {
    const trait = generateTrait(i);
    assert.ok(trait.length > 0);
  }
});

test("generateTrait contains no template placeholders", () => {
  const placeholders = [
    "{action}",
    "{time}",
    "{behavior}",
    "{condition}",
    "{quirk}",
    "{quality}",
    "{activity}",
    "{location}",
    "{aspiration}",
    "{secret}",
  ];

  for (let i = 0; i < 100; i++) {
    const trait = generateTrait(i);
    for (const placeholder of placeholders) {
      assert.ok(
        !trait.includes(placeholder),
        `Trait should not contain ${placeholder}: ${trait}`
      );
    }
  }
});

test("generateTrait produces variety of outputs", () => {
  const traits = new Set<string>();
  for (let i = 0; i < 100; i++) {
    traits.add(generateTrait(i * 1000));
  }
  assert.ok(traits.size >= 20, `Should have variety, got ${traits.size} unique traits`);
});
