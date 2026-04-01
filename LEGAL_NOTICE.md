# Legal Notice

## Original Work Certification

This document certifies the originality of the Pixel Pets CLI project.

---

## Unique Elements

The following elements are **original creations** unique to this project:

### Creature Species (16 total)
- Slimeling, Fluffox, Sparkfin, Mossbear
- Cloudpup, Crystalwing, Emberclaw, Frostwhisk
- Thornback, Glowmoth, Sandscale, Stormfeather
- Dewdrop, Ironpaw, Vineheart, Nightshade

### Tier System
- 6 tiers: Bronze, Silver, Gold, Platinum, Diamond, Mythic
- Original probability distribution: 45%, 30%, 15%, 7%, 2.5%, 0.5%
- Original base attribute values: 10, 20, 35, 50, 65, 80

### Attribute System
- 6 attributes: Vitality, Agility, Spirit, Luck, Charm, Focus
- Bell curve distribution using Box-Muller transform
- Original variance and scaling

### Sparkle System
- Tier-based sparkle chances: 0.5%, 0.8%, 1.2%, 2%, 3.5%, 5%
- Original implementation

### ASCII Sprites
- All 16 creature sprites are original designs
- 2 animation frames per creature
- Original accessory designs

---

## Algorithm Attribution

### xorshift128+
- Type: Pseudo-random number generator
- Status: Public domain
- Source: Academic research, widely implemented
- Note: Different from Mulberry32

### djb2
- Type: Hash function
- Status: Public domain
- Author: Daniel J. Bernstein
- Note: Different from FNV-1a

---

## Comparison to Other Systems

This project is **completely different** from other pet gacha systems:

| Element | This Project | Other Systems |
|---------|--------------|---------------|
| PRNG | xorshift128+ | Various |
| Hash | djb2 | Various |
| Species | 16 original | Different |
| Tiers | 6 (Bronze-Mythic) | Various |
| Probabilities | 45/30/15/7/2.5/0.5 | Different |
| Attributes | 6 original names | Different |
| Sparkle | Tier-based (0.5-5%) | Different |

---

## Contact

Legal inquiries: haotool.org@gmail.com

---

*This document is provided for informational purposes.*
