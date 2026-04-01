/**
 * Pixel Pets CLI - Local Storage
 * 
 * Stores pet collection in user's home directory.
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import type { PixelPet } from "./types.js";

const STORAGE_DIR = path.join(os.homedir(), ".pixel-pets");
const STORAGE_FILE = path.join(STORAGE_DIR, "collection.json");

/** Ensure storage directory exists */
function ensureStorageDir(): void {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

/** Load all pets from storage */
export function loadPets(): PixelPet[] {
  ensureStorageDir();
  if (!fs.existsSync(STORAGE_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(STORAGE_FILE, "utf-8");
    return JSON.parse(data) as PixelPet[];
  } catch {
    return [];
  }
}

/** Save pets to storage */
export function savePets(pets: PixelPet[]): void {
  ensureStorageDir();
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(pets, null, 2));
}

/** Add a new pet */
export function addPet(pet: PixelPet): void {
  const pets = loadPets();
  pets.push(pet);
  savePets(pets);
}

/** Find pet by nickname */
export function findPetByNickname(nickname: string): PixelPet | undefined {
  const pets = loadPets();
  const lower = nickname.toLowerCase();
  return pets.find((p) => p.nickname.toLowerCase().includes(lower));
}

/** Clear all pets */
export function clearPets(): void {
  savePets([]);
}

/** Get storage path */
export function getStoragePath(): string {
  return STORAGE_FILE;
}
