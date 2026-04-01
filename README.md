<h1 align="center">Pixel Pets CLI</h1>

<p align="center">
  <strong>Terminal pet collection game - summon and collect pixel companions</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.1.1-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg" alt="Node">
</p>

---

## Quick Start

```bash
# Run instantly without installation
npx pixel-pets-cli

# Summon a pet immediately
npx pixel-pets-cli pull

# Summon 10 pets
npx pixel-pets-cli pull -n 10

# Summon until getting a Gold tier or higher
npx pixel-pets-cli pull -u g

# Summon up to 100 times or until Diamond
npx pixel-pets-cli pull -n 100 -u d
```

---

## Installation (Optional)

```bash
# Global install for faster access
npm install -g pixel-pets-cli

# Then use directly
pixel-pets-cli pull
pixel-pets pull      # Alias
ppets pull           # Short alias
```

---

## Commands

| Command | Description |
|---------|-------------|
| `pull [seed]` | Summon a new pet |
| `pull -n <count>` | Summon multiple pets |
| `pull -u <tier>` | Summon until reaching tier |
| `pull -n 100 -u gold` | Summon up to 100 or until gold |
| `list` | Show your pet collection |
| `show <name>` | Display detailed pet card |
| `animate <name>` | Watch pet animation |
| `stats` | Show collection statistics |
| `rates` | Display summon rates |
| `clear --confirm` | Clear all pets |
| `help` | Show help information |

### Tier Shortcuts

| Shortcut | Tier |
|----------|------|
| `b` | Bronze |
| `s` | Silver |
| `g` | Gold |
| `p` | Platinum |
| `d` | Diamond |
| `m` | Mythic |

---

## Summon System

### Tier Distribution

| Tier | Probability | Base Stats | Sparkle Chance |
|------|-------------|------------|----------------|
| [B] Bronze | 45% | 10 | 0.5% |
| [S] Silver | 30% | 20 | 0.8% |
| [G] Gold | 15% | 35 | 1.2% |
| [P] Platinum | 7% | 50 | 2.0% |
| [D] Diamond | 2.5% | 65 | 3.5% |
| [M] Mythic | 0.5% | 80 | 5.0% |

### Example Output

```
  Summoning until MYTHIC (max 100)...

  Progress: 49 pulls completed!

  Summon Results (49 total)
  ---------------------------------------------
  [B] bronze     x15
  [S] silver     x16
  [G] gold       x12
  [P] platinum   x5
  [M] mythic     x1 <-- TARGET
  * Sparkle pets: 1
  ---------------------------------------------
  Target MYTHIC reached!

  Best Pet Obtained:

+------------------------------------------+
| Lucky Flake                              |
| [M] MYTHIC (0.5%)                        |
+------------------------------------------+
|  Species: frostwhisk   Face: (~.~)       |
+------------------------------------------+
```

---

## Features

- **16 Original Creatures** - Slimeling, Fluffox, Sparkfin, Mossbear, Cloudpup, Crystalwing, Emberclaw, Frostwhisk, Thornback, Glowmoth, Sandscale, Stormfeather, Dewdrop, Ironpaw, Vineheart, Nightshade
- **6 Tier System** - Bronze, Silver, Gold, Platinum, Diamond, Mythic
- **Sparkle Variants** - Tier-based sparkle chances
- **6 Attributes** - Vitality, Agility, Spirit, Luck, Charm, Focus
- **Batch Summons** - Pull multiple pets at once
- **Target Summons** - Keep pulling until you get the tier you want
- **Animated Effects** - Premium gacha animation experience
- **Local Storage** - Your collection persists between sessions

---

## Technical Details

### Data Storage

Pets are stored locally at `~/.pixel-pets/collection.json`

### Algorithms Used

- **xorshift128+** - PRNG (public domain)
- **djb2** - Hash function (public domain)

---

## Language

| Language | Link |
|----------|------|
| English | [README.md](README.md) |
| Traditional Chinese | [README_zh-TW.md](docs/i18n/README_zh-TW.md) |
| Simplified Chinese | [README_zh-CN.md](docs/i18n/README_zh-CN.md) |
| Japanese | [README_ja.md](docs/i18n/README_ja.md) |
| Korean | [README_ko.md](docs/i18n/README_ko.md) |

---

## License

MIT License - see [LICENSE](LICENSE).

---

## Original Work Notice

This is an original, independent project. All code, creature designs, and game mechanics are original creations. See [DISCLAIMER.md](DISCLAIMER.md) for details.

---

<p align="center">
  <sub>An original project for educational and entertainment purposes.</sub>
</p>
