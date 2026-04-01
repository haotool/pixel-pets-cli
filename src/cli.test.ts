import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";

function runCli(args: string[], homeDir: string): string {
  return execFileSync(process.execPath, ["dist/index.js", ...args], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      HOME: homeDir,
    },
    encoding: "utf8",
  });
}

test("CLI help uses the published package name", () => {
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "pixel-pets-help-"));
  const output = runCli(["--help"], tempHome);

  assert.match(output, /Usage: pixel-pets-cli \[options\] \[command\]/);
  assert.match(output, /pull \[options\] \[seed\]/);
  assert.doesNotMatch(output, /--until|pull -u/);
});

test("CLI pull persists a summoned pet in isolated storage", () => {
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "pixel-pets-storage-"));
  runCli(["pull", "seed-4"], tempHome);

  const storagePath = path.join(tempHome, ".pixel-pets", "collection.json");
  assert.equal(fs.existsSync(storagePath), true);

  const pets = JSON.parse(fs.readFileSync(storagePath, "utf8")) as Array<{
    seedHash: string;
    accessory: string;
  }>;

  assert.equal(pets.length, 1);
  assert.equal(pets[0]!.seedHash, "seed-4");
  assert.notEqual(pets[0]!.accessory, "none");
});

test("CLI multi-pull reveals every pet and stores the full batch", () => {
  const tempHome = fs.mkdtempSync(path.join(os.tmpdir(), "pixel-pets-batch-"));
  const output = runCli(["pull", "gallery-seed", "-n", "3"], tempHome);

  assert.match(output, /Reveal 1\/3/);
  assert.match(output, /Reveal 2\/3/);
  assert.match(output, /Reveal 3\/3/);
  assert.match(output, /ATTRIBUTES/);
  assert.match(output, /SPRITE/);
  assert.match(output, /Summon Summary \(3 pets\)/);

  const storagePath = path.join(tempHome, ".pixel-pets", "collection.json");
  const pets = JSON.parse(fs.readFileSync(storagePath, "utf8")) as Array<{ seedHash: string }>;

  assert.equal(pets.length, 3);
  assert.deepEqual(
    pets.map((pet) => pet.seedHash),
    ["gallery-seed:1", "gallery-seed:2", "gallery-seed:3"]
  );
});
