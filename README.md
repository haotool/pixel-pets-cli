<h1 align="center">Pixel Pets CLI</h1>

<p align="center">
  <strong>Terminal pet collection game - summon and collect pixel companions</strong>
</p>

<p align="center">
  <a href="#features">Features</a> |
  <a href="#installation">Installation</a> |
  <a href="#usage">Usage</a> |
  <a href="#summon-system">Summon System</a> |
  <a href="#contributing">Contributing</a> |
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg" alt="Node">
</p>

---

## IMPORTANT NOTICE

```
+------------------------------------------------------------------------+
|                                                                        |
|  THIS IS AN ORIGINAL, INDEPENDENT PROJECT                              |
|                                                                        |
|  * All code is original implementation                                 |
|  * All creature designs are original creations                         |
|  * All game mechanics are independently designed                       |
|  * Created for educational and entertainment purposes                  |
|                                                                        |
|  This project uses standard, public domain algorithms:                 |
|  - xorshift128+ PRNG (Wikipedia documented)                            |
|  - djb2 hash function (public domain)                                  |
|                                                                        |
+------------------------------------------------------------------------+
```

---

## Language / Select Language

| Language | Link |
|----------|------|
| English | [README.md](README.md) |
| Traditional Chinese | [README_zh-TW.md](docs/i18n/README_zh-TW.md) |
| Simplified Chinese | [README_zh-CN.md](docs/i18n/README_zh-CN.md) |
| Japanese | [README_ja.md](docs/i18n/README_ja.md) |
| Korean | [README_ko.md](docs/i18n/README_ko.md) |
| Spanish | [README_es.md](docs/i18n/README_es.md) |
| French | [README_fr.md](docs/i18n/README_fr.md) |
| German | [README_de.md](docs/i18n/README_de.md) |
| Portuguese | [README_pt.md](docs/i18n/README_pt.md) |
| Russian | [README_ru.md](docs/i18n/README_ru.md) |

---

## Features

- **16 Original Creatures** - Slimeling, Fluffox, Sparkfin, Mossbear, Cloudpup, Crystalwing, Emberclaw, Frostwhisk, Thornback, Glowmoth, Sandscale, Stormfeather, Dewdrop, Ironpaw, Vineheart, Nightshade
- **6 Tier System** - Bronze, Silver, Gold, Platinum, Diamond, Mythic
- **Sparkle Variants** - Tier-based sparkle chances (0.5% - 5%)
- **6 Attributes** - Vitality, Agility, Spirit, Luck, Charm, Focus
- **Accessories** - 9 original accessory types
- **Deterministic Summons** - Use seeds for reproducible results
- **Animated ASCII Sprites** - Original 2-frame animations

---

## Installation

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/haotool/pixel-pets-cli.git
cd pixel-pets-cli

# Install dependencies
npm install

# Run the game
npm run dev -- help
```

### Build from Source

```bash
npm run build
node dist/index.js help
```

---

## Usage

### Commands

| Command | Description |
|---------|-------------|
| `pull [seed]` | Summon a new pet (optional seed) |
| `list` | Show your pet collection |
| `show <name>` | Display detailed pet card |
| `animate <name>` | Watch pet animation |
| `stats` | Show collection statistics |
| `rates` | Display summon rates |
| `clear --confirm` | Clear all pets |
| `help` | Show help information |

### Examples

```bash
# Summon a random pet
npm run dev -- pull

# Summon with specific seed
npm run dev -- pull my-lucky-seed

# View collection
npm run dev -- list

# Check summon rates
npm run dev -- rates
```

---

## Summon System

### Tier Distribution (ORIGINAL VALUES)

| Tier | Probability | Base Attributes | Sparkle Chance |
|------|-------------|-----------------|----------------|
| [B] Bronze | 45% | 10 | 0.5% |
| [S] Silver | 30% | 20 | 0.8% |
| [G] Gold | 15% | 35 | 1.2% |
| [P] Platinum | 7% | 50 | 2.0% |
| [D] Diamond | 2.5% | 65 | 3.5% |
| [M] Mythic | 0.5% | 80 | 5.0% |

### Attribute Generation

Uses Bell curve distribution (Box-Muller transform):
- Base value determined by tier
- Variance of 25 points
- Range: 1-100

### PRNG Implementation

This project uses **xorshift128+**, a well-documented public domain algorithm:

```typescript
class XorShift128Plus {
  private s0: number;
  private s1: number;
  // ... implementation
}
```

String hashing uses **djb2**, another public domain algorithm.

---

## Technical Details

### Data Storage

Pets are stored locally at `~/.pixel-pets/collection.json`

### Project Structure

```
pixel-pets-cli/
+-- src/
|   +-- index.ts      # CLI entry point
|   +-- types.ts      # Type definitions (original)
|   +-- gacha.ts      # Summon mechanics (xorshift128+, djb2)
|   +-- sprites.ts    # Original ASCII sprites
|   +-- display.ts    # Terminal display
|   +-- names.ts      # Original name generation
|   +-- storage.ts    # Local storage
+-- docs/
|   +-- i18n/         # Translations
+-- dist/             # Compiled output
```

---

## Original Implementation Statement

This project is an **original creation**. The following are unique to this project:

1. **All 16 creature species** - Original names and designs
2. **All ASCII sprites** - Created specifically for this project
3. **Tier system** - Original 6-tier structure with unique probabilities
4. **Attribute system** - Original 6 attributes with Bell curve distribution
5. **Name generation** - Original adjective/suffix combinations

**Public domain algorithms used:**
- xorshift128+ PRNG - Documented on Wikipedia
- djb2 hash - Created by Daniel J. Bernstein, public domain

---

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

MIT License - see [LICENSE](LICENSE).

---

<p align="center">
  <sub>An original project for educational and entertainment purposes.</sub>
</p>
