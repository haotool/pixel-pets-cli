import test from "node:test";
import assert from "node:assert/strict";
import {
  roll,
  createSeed,
  getTierProbability,
  getSparkleProbability,
} from "./gacha.js";
import { TIERS, TIER_WEIGHTS, SPARKLE_CHANCE, CREATURES, ATTRIBUTES } from "./types.js";

test("roll produces deterministic output for same seed", () => {
  const result1 = roll("test-seed-123");
  const result2 = roll("test-seed-123");
  assert.deepEqual(result1.core.species, result2.core.species);
  assert.deepEqual(result1.core.tier, result2.core.tier);
  assert.deepEqual(result1.core.expression, result2.core.expression);
  assert.deepEqual(result1.identitySeed, result2.identitySeed);
});

test("roll produces different output for different seeds", () => {
  const result1 = roll("seed-alpha");
  const result2 = roll("seed-beta");
  const same =
    result1.core.species === result2.core.species &&
    result1.core.tier === result2.core.tier &&
    result1.identitySeed === result2.identitySeed;
  assert.equal(same, false);
});

test("roll returns valid creature species", () => {
  for (let i = 0; i < 100; i++) {
    const { core } = roll(`species-test-${i}`);
    assert.ok(CREATURES.includes(core.species));
  }
});

test("roll returns valid tier", () => {
  for (let i = 0; i < 100; i++) {
    const { core } = roll(`tier-test-${i}`);
    assert.ok(TIERS.includes(core.tier));
  }
});

test("roll generates attributes within valid range [1-100]", () => {
  for (let i = 0; i < 50; i++) {
    const { core } = roll(`attr-test-${i}`);
    for (const attr of ATTRIBUTES) {
      const value = core.attributes[attr];
      assert.ok(value >= 1, `${attr} should be >= 1, got ${value}`);
      assert.ok(value <= 100, `${attr} should be <= 100, got ${value}`);
    }
  }
});

test("createSeed generates unique seeds", () => {
  const seeds = new Set<string>();
  for (let i = 0; i < 100; i++) {
    seeds.add(createSeed());
  }
  assert.equal(seeds.size, 100);
});

test("createSeed follows expected format", () => {
  const seed = createSeed();
  assert.match(seed, /^px-[a-z0-9]+-[a-z0-9]+$/);
});

test("getTierProbability returns correct percentages", () => {
  const total = Object.values(TIER_WEIGHTS).reduce((sum, w) => sum + w, 0);
  for (const tier of TIERS) {
    const expected = (TIER_WEIGHTS[tier] / total) * 100;
    const actual = getTierProbability(tier);
    assert.equal(actual, expected);
  }
});

test("getSparkleProbability returns correct percentages", () => {
  for (const tier of TIERS) {
    const expected = SPARKLE_CHANCE[tier] * 100;
    const actual = getSparkleProbability(tier);
    assert.equal(actual, expected);
  }
});

test("tier distribution approximates expected weights over many rolls", () => {
  const counts: Record<string, number> = {};
  for (const tier of TIERS) counts[tier] = 0;

  const iterations = 10000;
  for (let i = 0; i < iterations; i++) {
    const { core } = roll(`distribution-test-${i}`);
    counts[core.tier]++;
  }

  const total = Object.values(TIER_WEIGHTS).reduce((sum, w) => sum + w, 0);
  for (const tier of TIERS) {
    const expected = (TIER_WEIGHTS[tier] / total) * iterations;
    const actual = counts[tier]!;
    const tolerance = Math.max(expected * 0.25, 15);
    assert.ok(
      Math.abs(actual - expected) < tolerance,
      `${tier}: expected ~${expected.toFixed(0)}, got ${actual}`
    );
  }
});

test("bronze tier pets have no accessory", () => {
  let bronzeFound = 0;
  for (let i = 0; bronzeFound < 20 && i < 1000; i++) {
    const { core } = roll(`bronze-accessory-${i}`);
    if (core.tier === "bronze") {
      assert.equal(core.accessory, "none");
      bronzeFound++;
    }
  }
  assert.ok(bronzeFound > 0, "Should find at least one bronze pet");
});
