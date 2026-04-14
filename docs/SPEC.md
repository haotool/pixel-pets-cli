# Pixel Pets CLI - Technical Specification v3.0.0

> Last Updated: 2026-04-02
> Author: haotool
> Status: Production Ready

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Sprite System](#3-sprite-system)
4. [Animation System](#4-animation-system)
5. [Creature Catalog](#5-creature-catalog)
6. [Accessory System](#6-accessory-system)
7. [Expression System](#7-expression-system)
8. [Gacha Mechanics](#8-gacha-mechanics)
9. [Testing Requirements](#9-testing-requirements)
10. [API Reference](#10-api-reference)

---

## 1. Overview

### 1.1 Project Goals

Pixel Pets CLI is a terminal-based pet collection game featuring:
- 16 original ASCII creature designs with distinct silhouettes
- Deterministic gacha system with seed-based RNG
- Rich terminal animations with TTY-aware fallbacks
- Local persistent storage

### 1.2 Design Principles

| Principle | Description |
|-----------|-------------|
| **SSOT** | Single Source of Truth - all constants in `types.ts` |
| **KISS** | Keep It Simple - minimal abstractions |
| **DRY** | Don't Repeat Yourself - shared utilities |
| **Determinism** | Same seed = same result |

### 1.3 Technical Stack

- **Runtime**: Node.js >= 18.0.0
- **Language**: TypeScript 5.x (strict mode)
- **Module**: ESM (`"type": "module"`)
- **Testing**: Node.js native test runner
- **Dependencies**: chalk, commander, ora, string-width

---

## 2. Architecture

### 2.1 Module Structure

```
src/
├── index.ts      # CLI entry point
├── types.ts      # Domain types and constants (SSOT)
├── sprites.ts    # ASCII art definitions and rendering
├── display.ts    # Terminal UI and animations
├── gacha.ts      # RNG and probability system
├── names.ts      # Nickname and trait generation
└── storage.ts    # Local file persistence
```

### 2.2 Data Flow

```
seed → gacha.roll() → CreatureCore + identitySeed
                           ↓
                    names.generate*()
                           ↓
                      PixelPet
                           ↓
              storage.addPet() / display.*()
```

### 2.3 Type Hierarchy

```typescript
CreatureCore {
  tier, species, expression, accessory, sparkle, attributes
}
       ↓
CreatureIdentity {
  nickname, trait
}
       ↓
PixelPet extends CreatureCore, CreatureIdentity {
  obtainedAt, seedHash
}
```

---

## 3. Sprite System

### 3.1 Sprite Dimensions

| Property | Value | Rationale |
|----------|-------|-----------|
| **Height** | 5 lines | Compact yet expressive |
| **Width** | 12 characters | Fits terminal columns |
| **Frames** | 3 per species | Idle, Action, Secondary |
| **Placeholder** | `{E}` | Eye expression slot |

### 3.2 Sprite Template

```
Line 1: Head/Top decoration (ears, horns, antenna)
Line 2: Face with {E}{E} eye placeholders
Line 3: Body upper section
Line 4: Body lower section
Line 5: Base/Feet/Tail
```

### 3.3 Character Density Reference

From dark to light (for shading):
```
$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\|()1{}[]?-_+~<>i!lI;:,"^`'. 
```

### 3.4 Design Guidelines

Based on research from ASCII art archives and design best practices:

**Primary Sources Consulted:**
1. ASCII Art Archive (asciiart.eu) - 11,000+ artworks
2. Joan Stark Collection (jgs) - Classic 5-line designs
3. Christopher Johnson's Collection - Fantasy creatures
4. Kaomoji patterns - Japanese emoticon faces
5. RogueBasin - Roguelike conventions
6. Dwarf Fortress Wiki - Tileset design
7. TextPaint - ASCII drawing techniques
8. Sprite-AI - Pixel art silhouette principles
9. Term::Animation - Animation framework patterns
10. One-line ASCII Art Archive - Compact designs

**Design Rules:**

1. **Silhouette First**: Design must be recognizable as outline alone
2. **Symmetry**: Bilateral symmetry for most creatures
3. **Character Choice**:
   - `()` for rounded bodies (slime, blob)
   - `[]` for angular/mechanical (robot, armor)
   - `/\` for pointed features (ears, wings)
   - `~` for wavy/fluid elements (water, vine)
   - `*` for sparkle/magical effects
   - `.` for ethereal/shadow elements
4. **Aspect Ratio**: Terminal chars are ~2:1 (height:width)
5. **Whitespace**: Strategic spacing for depth perception
6. **Eye Placement**: Consistent `{E}` positioning for expression

### 3.5 Visual Distinction Matrix

Each species must be distinguishable by:

| Feature | Requirement |
|---------|-------------|
| Silhouette | Unique outline shape |
| Head Shape | Distinct ear/horn/antenna pattern |
| Body Type | Round vs angular vs fluid |
| Base/Feet | Species-specific ground contact |
| Signature Element | One unique visual marker |

---

## 4. Animation System

### 4.1 Frame Types

| Frame ID | Type | Description |
|----------|------|-------------|
| `0` | Rest | Default idle pose |
| `1` | Action | Primary movement (bounce, flap, etc.) |
| `2` | Secondary | Alternative movement |
| `-1` | Blink | Eyes replaced with `-` |

### 4.2 Animation Sequence

```typescript
const IDLE_SEQUENCE: readonly FrameId[] = [
  0, 0, 0, 0,    // Rest (4 beats) - establishes base pose
  1, 0, 0, 0,    // Action then rest (4 beats) - primary motion
  -1, 0, 0,      // Blink then rest (3 beats) - life indicator
  2, 0, 0, 0     // Secondary then rest (4 beats) - variety
] as const;
```

**Timing Analysis:**
- Total frames: 15
- Frame duration: 400ms
- Full cycle: 6 seconds
- Blink frequency: Once per 6 seconds (natural rhythm)

### 4.3 Blink Mechanism

```typescript
const BLINK_GLYPH = "-";

function renderFrame(core: CreatureCore, frameId: FrameId): string[] {
  const expr = frameId === -1 ? BLINK_GLYPH : core.expression;
  const frameIndex = frameId === -1 ? 0 : frameId;
  return SPRITES[core.species][frameIndex]
    .map(line => line.replaceAll("{E}", expr));
}
```

### 4.4 Sparkle Animation

For sparkle variants, rotating sparkle appended to sprite:

```typescript
const SPARKLE_FRAMES = ["✦", "✧", "·", "✧"] as const;
```

---

## 5. Creature Catalog

### 5.1 Species Overview

| ID | Species | Element | Visual Theme | Signature Feature |
|----|---------|---------|--------------|-------------------|
| 1 | slimeling | Neutral | Bouncy blob | Amorphous curves `~~~` |
| 2 | fluffox | Nature | Fluffy fox | Pointed ears `/\` + tail `~` |
| 3 | sparkfin | Water | Electric fish | Fish shape `><>` + fins |
| 4 | mossbear | Earth | Nature bear | Round ears `^` + sturdy base |
| 5 | cloudpup | Air | Sky puppy | Floppy ears `n` + cloud base `~~` |
| 6 | crystalwing | Crystal | Gem butterfly | Symmetrical wings `*\/*` |
| 7 | emberclaw | Fire | Fire lizard | Flame top `~*~` + claws |
| 8 | frostwhisk | Ice | Ice cat | Cat ears `/\_/\` + frost `*` |
| 9 | thornback | Plant | Plant turtle | Spiky shell `/\/\/\` |
| 10 | glowmoth | Light | Luminous moth | Wide wings `\*/` + glow `*` |
| 11 | sandscale | Earth | Desert snake | Coiled body `===` + sand `~~~` |
| 12 | stormfeather | Storm | Thunder bird | Feathers `\\//` + lightning |
| 13 | dewdrop | Water | Water sprite | Droplet `o` + ripples |
| 14 | ironpaw | Metal | Metal wolf | Angular brackets `[]` |
| 15 | vineheart | Plant | Forest spirit | Organic curves `~\~/` |
| 16 | nightshade | Shadow | Shadow creature | Dots `.` + ethereal |

### 5.2 Sprite Definitions (5×12, 3 frames)

All sprites follow strict 5-line height with consistent eye placeholder positioning.

#### slimeling (Bouncy Blob)
```
Frame 0 (Rest):        Frame 1 (Bounce):      Frame 2 (Squish):
    ___                .  ___  .                _____  
  ({E} {E})              ({E} {E})             ({E}   {E})
 (       )            (       )             (       )
  (     )              (     )               (  )    
   ~~~                  ~~~                   ~~~    
```
**Recognition**: Amorphous round shape, wavy base

#### fluffox (Fluffy Fox)
```
Frame 0 (Rest):        Frame 1 (Ear twitch):  Frame 2 (Tail wag):
 /\     /\             /\     /\             /\     /\
( {E} v {E} )          ( {E} v {E} )         ( {E} v {E} )
  \===/                 \===/                 \===/  
   |~|                   |~|                   |~|   
   |_|~                  |_|                   |_|~~ 
```
**Recognition**: Pointed fox ears, v-shaped nose, fluffy tail

#### sparkfin (Electric Fish)
```
Frame 0 (Rest):        Frame 1 (Swim):        Frame 2 (Spark):
  ><{E}>                 ><{E}>              *><{E}>* 
 /======\              /======\             /======\ 
<  ~~~~  >            < ~~~~~ >            <  ~~~~  >
 \======/              \======/             \======/ 
   ><><                  ><><                 ><><   
```
**Recognition**: Fish shape with fins, electric sparks

#### mossbear (Nature Bear)
```
Frame 0 (Rest):        Frame 1 (Sniff):       Frame 2 (Stretch):
  ^     ^                ^     ^               ^     ^ 
 ({E}   {E})            ({E}   {E})           ({E}   {E})
 (======)              (======)              (======) 
  |    |                |    |                |~~~~| 
 _|____|_              _|____|_              _|____|_ 
```
**Recognition**: Round bear ears, sturdy rectangular base

#### cloudpup (Sky Puppy)
```
Frame 0 (Rest):        Frame 1 (Wag):         Frame 2 (Float):
  n     n                n     n               n     n 
 ({E} w {E})            ({E} w {E})           ({E} w {E})
  (    )                 (    )                (    ) 
 ~~    ~~              ~~~  ~~~              ~~    ~~ 
   ~~~~                   ~~~~                ~~~~~~  
```
**Recognition**: Floppy ears, w-mouth, cloud base

#### crystalwing (Gem Butterfly)
```
Frame 0 (Rest):        Frame 1 (Flutter):     Frame 2 (Shimmer):
*\      /*             *\      /*            *\      /*
  ({E}{E})               ({E}{E})             *({E}{E})*
 *|    |*               *|    |*              *|    |*
  \    /                 \    /                \    / 
   \  /                   \  /                  \  /  
```
**Recognition**: Symmetrical crystal wings, gem body

#### emberclaw (Fire Lizard)
```
Frame 0 (Rest):        Frame 1 (Flame):       Frame 2 (Strike):
 ~ ~ ~ ~               ~*~*~*~*~              ~ ~ ~ ~ 
 /{E}  {E}\             /{E}  {E}\            /{E}  {E}\
 |======|              |======|              |======| 
  /|  |\                /|  |\                /|  |\ 
 ~ || ~                ~ || ~               ~~ || ~~ 
```
**Recognition**: Flame crown, lizard claws, fire base

#### frostwhisk (Ice Cat)
```
Frame 0 (Rest):        Frame 1 (Pounce):      Frame 2 (Frost):
  /\_/\                  /\_/\                 /\_/\  
 ( {E} {E} )            ( {E} {E} )           ( {E} {E} )
  >   <                  >   <                 >   <  
 *~~~~~*               *~~~~~*              **~~~~~**
  *   *                  *   *                * * *  
```
**Recognition**: Cat ears, whisker marks, frost crystals

#### thornback (Plant Turtle)
```
Frame 0 (Rest):        Frame 1 (Walk):        Frame 2 (Retract):
 /\/\/\/\              /\/\/\/\              /\/\/\/\ 
| {E}  {E} |           | {E}  {E} |          | {E}  {E} |
|[======]|            |[======]|            |[======]| 
 \_    _/              \_    _/              \_    _/ 
  |____|                 |__|                 |____|  
```
**Recognition**: Spiky shell pattern, turtle legs

#### glowmoth (Luminous Moth)
```
Frame 0 (Rest):        Frame 1 (Glow):        Frame 2 (Fly):
 \*    */              \*    */             *\*  */* 
  ({E}{E})               ({E}{E})              ({E}{E}) 
 /|    |\              /|    |\             /|    |\ 
  *    *                **  **               *    *  
   \  /                   \/                  \  /   
```
**Recognition**: Wide moth wings, glowing body, antenna

#### sandscale (Desert Snake)
```
Frame 0 (Rest):        Frame 1 (Slither):     Frame 2 (Coil):
   {E}{E}                  {E}{E}                {E}{E}   
  /==\                    /==\                  /==\    
 /====\                 ~/====\~              /====\   
~~~~~~~~               ~~~~~~~~              ~~~~~~~~ 
 ~~~~~~                 ~~~~~~                ~~~~~~  
```
**Recognition**: Snake head, coiled body, sand waves

#### stormfeather (Thunder Bird)
```
Frame 0 (Rest):        Frame 1 (Flap):        Frame 2 (Thunder):
 \\    //              \\    //             *\\  //* 
  ({E}{E})               ({E}{E})              ({E}{E}) 
 //====\\              //====\\             //====\\ 
   |  |                  |  |                 |  |   
   |__|                  |__|                 |__|   
```
**Recognition**: Feathered wings, bird stance, lightning

#### dewdrop (Water Sprite)
```
Frame 0 (Rest):        Frame 1 (Ripple):      Frame 2 (Splash):
    o                   o   o                  o o    
  ({E}{E})               ({E}{E})              ({E}{E}) 
 (      )              (      )             (      ) 
  `~~~~`                `~~~~`               `~~~~`  
   ~~~~                  ~~~~                 ~~~~   
```
**Recognition**: Water droplet crown, fluid body, ripples

#### ironpaw (Metal Wolf)
```
Frame 0 (Rest):        Frame 1 (Howl):        Frame 2 (Guard):
  [    ]                [    ]                [    ]  
 [{E}  {E}]             [{E}  {E}]            [{E}  {E}]
 [======]              [======]              [======] 
  |____|                |____|                |____|  
  |    |-              |    |                |    |= 
```
**Recognition**: Angular brackets, mechanical joints

#### vineheart (Forest Spirit)
```
Frame 0 (Rest):        Frame 1 (Bloom):       Frame 2 (Sway):
 ~\    /~             ~~\  /~~              ~\    /~ 
  ({E}{E})              ~({E}{E})~             ({E}{E}) 
 ~|    |~              ~|    |~             ~~|  |~~ 
  \____/                \____/                \____/ 
 ~/    \~              ~/    \~              ~/    \~ 
```
**Recognition**: Organic vine curves, nature heart

#### nightshade (Shadow Creature)
```
Frame 0 (Rest):        Frame 1 (Fade):        Frame 2 (Appear):
  .    .               .      .               .    .  
 .{E}  {E}.            . {E}  {E} .          .{E}  {E}.
  (    )                (    )                (    ) 
 . \__/ .              .  \/  .              . \__/ . 
   .  .                 .    .                 .  .  
```
**Recognition**: Ethereal dots, shadow form, fading effect

---

## 6. Accessory System

### 6.1 Accessory Definitions

| ID | Name | ASCII | Position | Tier Availability |
|----|------|-------|----------|-------------------|
| 0 | none | (empty) | - | All |
| 1 | ribbon | `    ~    ` | Above head | Silver+ |
| 2 | bowtie | `   ><>   ` | Above head | Silver+ |
| 3 | flower | `   @     ` | Above head | Silver+ |
| 4 | bandana | `  ~~~~   ` | Above head | Gold+ |
| 5 | goggles | `  [==]   ` | Above head | Gold+ |
| 6 | scarf | `  ////   ` | Above head | Gold+ |
| 7 | bell | `    o    ` | Above head | Platinum+ |
| 8 | feather | `    /    ` | Above head | Platinum+ |

### 6.2 Rendering Rule

Accessories prepend one line above the sprite body:

```typescript
function renderSprite(core: CreatureCore, frameId: FrameId): string[] {
  const body = getFrameLines(core.species, frameId, core.expression);
  return core.accessory === "none" 
    ? body 
    : [ACCESSORY_LINES[core.accessory], ...body];
}
```

Total height with accessory: 6 lines

---

## 7. Expression System

### 7.1 Expression Glyphs

| Glyph | Name | Emotion | Usage |
|-------|------|---------|-------|
| `^` | Happy | Joyful, content | Default positive |
| `o` | Neutral | Calm, observant | Default state |
| `=` | Sleepy | Tired, relaxed | Low energy |
| `*` | Excited | Sparkly, amazed | High energy |
| `~` | Playful | Mischievous | Playful mood |
| `u` | Sad | Melancholy | Negative state |
| `w` | Cute | Kawaii style | Special cute |

### 7.2 Blink Expression

During blink frames (`-1`), all expressions become `-`:

```typescript
const BLINK_GLYPH = "-";
```

---

## 8. Gacha Mechanics

### 8.1 Tier Distribution

| Tier | Weight | Probability | Base Stats | Sparkle % |
|------|--------|-------------|------------|-----------|
| Bronze | 450 | 45.0% | 10 | 0.5% |
| Silver | 300 | 30.0% | 20 | 0.8% |
| Gold | 150 | 15.0% | 35 | 1.2% |
| Platinum | 70 | 7.0% | 50 | 2.0% |
| Diamond | 25 | 2.5% | 65 | 3.5% |
| Mythic | 5 | 0.5% | 80 | 5.0% |

### 8.2 RNG Algorithm

- **PRNG**: xorshift128+ (public domain)
- **Hash**: djb2 for seed string conversion
- **Attribute Distribution**: Box-Muller normal distribution

### 8.3 Accessory Pool by Tier

| Tier | Available Accessories |
|------|----------------------|
| Bronze | none only |
| Silver | none, ribbon, bowtie, flower |
| Gold+ | All accessories |

---

## 9. Testing Requirements

### 9.1 Test Coverage Targets

| Module | Target | Priority |
|--------|--------|----------|
| sprites.ts | 95% | Critical |
| gacha.ts | 95% | Critical |
| names.ts | 90% | High |
| storage.ts | 85% | Medium |
| display.ts | 80% | Medium |

### 9.2 Required Test Cases

#### Sprite Tests
- [x] All 16 species render correctly at 5 lines
- [x] All 3 frames render for each species
- [x] Expression placeholder replacement works
- [x] Accessory prepending works
- [x] Blink frame renders `-` for eyes
- [ ] Each species has unique silhouette (visual verification)
- [ ] No `{E}` placeholders remain after rendering

#### Gacha Tests
- [x] Deterministic output for same seed
- [x] Tier distribution matches weights
- [x] Attribute generation within bounds [1-100]
- [x] Sparkle probability per tier
- [x] Bronze tier has no accessory

#### Visual Verification Tests
- [ ] Silhouette recognition test
- [ ] Expression visibility test
- [ ] Animation frame distinction test
- [ ] Accessory compatibility test

### 9.3 Visual Verification Matrix

```typescript
interface VisualTest {
  species: Creature;
  silhouetteRecognizable: boolean;
  expressionVisible: boolean;
  animationDistinct: boolean;
  accessoryCompatible: boolean;
}
```

---

## 10. API Reference

### 10.1 Core Types

```typescript
// types.ts
type Tier = "bronze" | "silver" | "gold" | "platinum" | "diamond" | "mythic";
type Creature = "slimeling" | "fluffox" | ... | "nightshade";
type Expression = "^" | "o" | "=" | "*" | "~" | "u" | "w";
type Accessory = "none" | "ribbon" | "bowtie" | ... | "feather";
type Attribute = "VITALITY" | "AGILITY" | "SPIRIT" | "LUCK" | "CHARM" | "FOCUS";
type FrameId = 0 | 1 | 2 | -1;
```

### 10.2 Sprite Functions

```typescript
// sprites.ts
function renderSprite(core: CreatureCore, frameId: FrameId): string[];
function renderFace(core: CreatureCore): string;
function getFrameCount(species: Creature): number;
function validateSpriteDimensions(): boolean;
```

### 10.3 Animation Constants

```typescript
// types.ts
const IDLE_SEQUENCE: readonly FrameId[];
const FRAME_DURATION_MS = 400;
const BLINK_GLYPH = "-";
const SPRITE_HEIGHT = 5;

// sprites.ts
const SPARKLE_FRAMES: readonly string[];
```

### 10.4 Gacha Functions

```typescript
// gacha.ts
function roll(seed: string): GachaResult;
function createSeed(): string;
function getTierProbability(tier: Tier): number;
function getSparkleProbability(tier: Tier): number;
```

---

## Appendix A: ASCII Art Design Resources

### A.1 Primary References

| Resource | URL | Notes |
|----------|-----|-------|
| ASCII Art Archive | asciiart.eu | 11,000+ artworks, animals section |
| Joan Stark Collection | oldcompcz.github.io/jgs | Classic small ASCII (5-line) |
| Christopher Johnson | asciiart.website | Fantasy creatures |
| ASCII.co.uk | ascii.co.uk | One-liners, compact designs |
| Kaomoji House | kaomojihouse.com | Japanese emoticon patterns |
| RogueBasin | roguebasin.com | Roguelike conventions |
| Dwarf Fortress Wiki | dwarffortresswiki.org | Tileset design principles |
| TextPaint | textpaint.net | ASCII drawing editor |
| Sprite-AI | sprite-ai.art | Pixel art silhouette guide |
| Term::Animation | CPAN | Animation framework patterns |

### A.2 Design Tools

| Tool | Purpose |
|------|---------|
| TextPaint | Freehand ASCII drawing |
| FIGlet | Text banner generation |
| Asciify | Image to ASCII conversion |
| ASCII Art Creator | Grid-based drawing |

### A.3 Technical References

| Topic | Source |
|-------|--------|
| Terminal Animation | Term::Animation, crossterm |
| Roguelike Conventions | RogueBasin, NetHack |
| Kaomoji Patterns | Wikipedia, Kaomoji House |
| Pixel Art Principles | Sprite-AI, PathBits |
| Silhouette Design | Game sprite best practices |

---

## Appendix B: Changelog

### v3.0.0 (Current)

- **BREAKING**: Complete sprite redesign for visual distinction
- **Added**: Comprehensive visual verification tests
- **Added**: Species recognition validation
- **Added**: Detailed design guidelines from research
- **Fixed**: All 16 species now have unique silhouettes
- **Fixed**: Consistent 5×12 sprite dimensions
- **Improved**: Animation sequence timing
- **Improved**: Documentation with design rationale

### v2.0.0

- Sprite dimensions changed from 4×9 to 5×12
- Animation frames increased from 2 to 3
- Added blink animation frame (-1)
- Added IDLE_SEQUENCE animation controller

### v1.2.2

- Initial stable release
- 16 creatures, 2 frames each
- Basic animation system

---

*End of Specification*
