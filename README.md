<h1 align="center">Pixel Pets CLI</h1>

<p align="center">
  <strong>Terminal pet collection game - summon and collect pixel companions</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.2.0-blue.svg" alt="Version">
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

# Summon 50 pets with a repeatable seed sequence
npx pixel-pets-cli pull gallery-seed -n 50

# Summon 100 pets with fast staged reveals
npx pixel-pets-cli pull -n 100
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
| `pull -n <count>` | Summon multiple pets with staged reveals |
| `pull <seed> -n <count>` | Run a repeatable multi-summon sequence |
| `list` | Show your pet collection |
| `show <name>` | Display detailed pet card |
| `animate <name>` | Watch pet animation |
| `stats` | Show collection statistics |
| `rates` | Display summon rates |
| `clear --confirm` | Clear all pets |
| `help` | Show help information |

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

### Multi-Summon Flow

```
  Summoning 10 pets...

  Gallery ready: 10 reveals

  Reveal 01/10
  +------------------------------------------+
  | Brave Thunder                            |
  | [P] PLATINUM (7.0%)                      |
  +------------------------------------------+
  |  Species: stormfeather Face: (oo)        |
  |  Expression: o  Accessory: feather       |
  +------------------------------------------+

  ...

  Summon Summary (10 pets)
  ---------------------------------------------
  [B] bronze     x4
  [S] silver     x3
  [G] gold       x2
  [P] platinum   x1
  ---------------------------------------------
```

---

## Features

- **16 Original Creatures** - Slimeling, Fluffox, Sparkfin, Mossbear, Cloudpup, Crystalwing, Emberclaw, Frostwhisk, Thornback, Glowmoth, Sandscale, Stormfeather, Dewdrop, Ironpaw, Vineheart, Nightshade
- **6 Tier System** - Bronze, Silver, Gold, Platinum, Diamond, Mythic
- **Sparkle Variants** - Tier-based sparkle chances
- **6 Attributes** - Vitality, Agility, Spirit, Luck, Charm, Focus
- **Probability-First Summons** - No tier targeting, every pull stays true to the published odds
- **Gallery-Style Multi Pulls** - Each pet is revealed with its own staged transition
- **Adaptive Detail Levels** - Small batches show full cards, large batches switch to compact reveal cards
- **TTY-Aware Rendering** - Rich animation in terminals and readable fallback output in non-interactive environments
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
