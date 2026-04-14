# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.5.0] - 2026-04-08

### Fixed

- **Complete visual alignment**: Head features (ears, antennae, crowns) now perfectly centered above eyes
- All sprite lines have consistent visual center at position 5-6
- Eliminated left-shift in head decorations that caused misalignment

### Changed

- Redesigned all 16 species with proper visual centering
- Head features now align directly above eye line
- Simplified body designs for cleaner silhouettes

### Visual Examples (All Perfectly Centered)

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ SLIMELING   │ FLUFFOX     │ CLOUDPUP    │ FROSTWHISK  │
├─────────────┼─────────────┼─────────────┼─────────────┤
│    .---.    │   /\   /\   │    U U      │    /\_/\    │
│    (o o)    │    (o o)    │    (o o)    │    (o o)    │
│   (     )   │     (w)     │     (w)     │    =\/=     │
│    \___/    │    /| |\    │    /| |\    │     ||      │
│    ~~~~~    │   (_   _)   │    ~~~~~    │    *~~*     │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

## [2.4.0] - 2026-04-04

### Fixed

- **Perfect eye alignment**: Unified eye pattern `(o o)` across all 16 species
- Consistent spacing: exactly ONE space between eyes for perfect symmetry
- All eye lines now use identical `({E} {E})` template pattern

### Changed

- Standardized eye row format: `   ({E} {E})    ` (16 raw chars → 12 rendered)
- Simplified sprite designs for maximum clarity and alignment
- Each species maintains unique silhouette with consistent eye placement

### Visual Examples

```
SLIMELING     FLUFFOX       SPARKFIN      MOSSBEAR
    ___         /\   /\                    (^ _ ^)
   (o o)         (o o)         ><o>          (o o)
  (     )        ( w )        /----\         ( _ )
   \___/         /| |\       <  ~~  >        /|\
   ~~~~~        (_| |_)       \----/        / | \
```

## [2.3.0] - 2026-04-04

### Fixed

- **Critical eye alignment fix**: All 16 species now have perfectly symmetric and aligned eyes
- Eyes are now equidistant from center line in all sprites
- Consistent `( o o )` pattern ensures visual balance

### Changed

- Complete sprite redesign focusing on symmetry and alignment
- Simplified face patterns for clearer recognition
- Each species maintains unique silhouette while ensuring proper alignment

### Design Principles Applied

- **Symmetric eye placement**: Eyes positioned at equal distance from center
- **Consistent spacing**: `( {E} {E} )` pattern with proper padding
- **Clear silhouettes**: Each species has recognizable features:
  - **slimeling**: Round blob `( o o )` with dome top
  - **fluffox**: Fox ears `/\   /\` with `( w )` mouth
  - **sparkfin**: Fish `><o>>` shape
  - **mossbear**: Bear ears `(^ _ ^)` with sturdy body
  - **cloudpup**: Floppy ears `U   U` with `(w)` nose
  - **crystalwing**: Crystal wings `*\   /*`
  - **emberclaw**: Flame crown `~^~^~^~`
  - **frostwhisk**: Cat ears `/\_/\` with whiskers `=\./=`
  - **thornback**: Spiky shell `/\/\/\`
  - **glowmoth**: Antennae `\* */` with spread wings
  - **sandscale**: Snake coil with `~~` tongue
  - **stormfeather**: Bird wings `\\  //` with `<v>` beak
  - **dewdrop**: Water droplet with `o` bubble
  - **ironpaw**: Robot head `_[]_` with `[==]` body
  - **vineheart**: Plant leaves `~\_/~` with vines
  - **nightshade**: Ghost `._.` with ethereal body

## [2.2.0] - 2026-04-04

### Changed

- **Major sprite redesign**: All 16 species completely redesigned for better visual recognition
- Improved silhouettes with clearer animal features (ears, tails, wings, etc.)
- Better use of ASCII characters for cute, recognizable pet shapes
- Each species now has a truly unique and identifiable appearance
- Face patterns updated to be unique for each species

### Design Improvements

- **slimeling**: Classic blob shape with clear dome and wavy base
- **fluffox**: Distinct fox ears and fluffy tail with =w= mouth
- **sparkfin**: Fish shape with ><o))> face and fins
- **mossbear**: Bear with round ears c(" ")o and sturdy legs
- **cloudpup**: Floppy U-shaped ears with (w) nose
- **crystalwing**: Crystal butterfly with *wings* and pointed body
- **emberclaw**: Fire creature with flame crown ~
- **frostwhisk**: Cat with /\_/\ ears and whiskers
- **thornback**: Armored creature with /\/\/\ spikes
- **glowmoth**: Moth with \* */ antennae and wings
- **sandscale**: Snake with distinctive head shape
- **stormfeather**: Bird with \\ // wings and v beak
- **dewdrop**: Water droplet with bubble on top
- **ironpaw**: Robot dog with [ ] square features
- **vineheart**: Plant creature with ~ vines
- **nightshade**: Ghost with . dots and ethereal shape

## [2.1.0] - 2026-04-02

### Added

- `SPRITE_WIDTH` constant (12 chars) for strict dimension validation
- `getSpriteValidationErrors()` function for detailed debugging
- Visual verification tests for species recognition
- Unique face pattern test for all 16 species
- Animation frame variation test
- Comprehensive SPEC.md v3.0 with ASCII design research

### Changed

- All 16 sprites redesigned with strict 5×12 rendered dimensions
- Each sprite line now validates to exactly 12 characters after rendering
- Improved visual distinction between all species
- Enhanced test coverage from 35 to 39 tests

### Fixed

- Sprite dimension validation now accounts for `{E}` placeholder expansion
- All species now have unique silhouettes verified by tests
- Face patterns are now unique for each species

## [2.0.0] - 2026-04-02

### Added

- 3-frame animation system (idle, action, secondary) for all 16 species
- Blink animation frame (-1) with eye replacement mechanism
- `IDLE_SEQUENCE` constant for animation timing control
- `FrameId` type for type-safe frame references
- `FRAME_DURATION_MS` constant (400ms per frame)
- `validateSpriteDimensions()` function for sprite validation
- Comprehensive test coverage for `gacha.ts`, `names.ts`, `storage.ts`
- Technical specification document (`docs/SPEC.md`)
- This changelog file

### Changed

- **BREAKING**: Sprite dimensions changed from 4×9 to 5×12
- **BREAKING**: Animation frames increased from 2 to 3 per species
- **BREAKING**: `renderSprite()` now accepts `FrameId` type instead of number
- Sparkle frames updated to use Unicode symbols (✦, ✧, ·)
- Animation duration increased from 3s to 6s for full sequence cycle
- All 16 creature sprites redesigned for better visual distinction

### Removed

- Unused `figlet` dependency
- Unused `@types/figlet` dev dependency
- `AFFECTION_FRAMES` export (reserved for future use)

### Fixed

- All sprites now render with consistent 5-line height
- Expression placeholder `{E}` correctly replaced in all frames
- Each species has visually distinct silhouette

## [1.2.2] - Previous Release

- Initial stable release
- 16 creatures with 2 animation frames each
- Basic gacha system with 6 tiers
- Local storage persistence

[2.5.0]: https://github.com/haotool/pixel-pets-cli/compare/v2.4.0...v2.5.0
[2.4.0]: https://github.com/haotool/pixel-pets-cli/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/haotool/pixel-pets-cli/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/haotool/pixel-pets-cli/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/haotool/pixel-pets-cli/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/haotool/pixel-pets-cli/compare/v1.2.2...v2.0.0
[1.2.2]: https://github.com/haotool/pixel-pets-cli/releases/tag/v1.2.2
