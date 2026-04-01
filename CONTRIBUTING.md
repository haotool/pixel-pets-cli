# Contributing to Pet Gacha CLI

Thank you for your interest in contributing to Pet Gacha CLI! This document provides guidelines and information for contributors.

---

## Important Notice

Before contributing, please read our [DISCLAIMER.md](DISCLAIMER.md) and [LEGAL_NOTICE.md](LEGAL_NOTICE.md) to understand the nature of this project. This is an **independent, unofficial, fan-made project** for educational and entertainment purposes only.

---

## Code of Conduct

By participating in this project, you agree to:

- Be respectful and inclusive to all contributors
- Provide constructive feedback
- Focus on the code, not the person
- Accept responsibility for your contributions
- Respect the project's educational and entertainment purpose

---

## How to Contribute

### Reporting Issues

1. Check if the issue already exists
2. Use a clear and descriptive title
3. Provide detailed reproduction steps
4. Include your environment details (OS, Node.js version, etc.)

### Submitting Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/haotool/pet-gacha-cli.git
   cd pet-gacha-cli
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation as needed

4. **Test your changes**
   ```bash
   npm install
   npm run dev -- help
   npm run build
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new species type"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

---

## What We Accept

**Welcome contributions:**
- New pet species with ORIGINAL ASCII art
- Bug fixes and performance improvements
- Documentation improvements
- Translations for README
- New features that enhance the game experience
- Code quality improvements

**Not accepted:**
- Any code copied from proprietary sources
- Features that could be mistaken for official products
- Changes that remove disclaimer notices
- Malicious code or security vulnerabilities

---

## Original Work Requirement

All contributions MUST be original work. By submitting a contribution, you certify that:

1. The contribution is your own original work
2. You have the right to submit the contribution
3. The contribution does not infringe on any third-party rights
4. You have not copied code from any proprietary source

---

## Development Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev -- [command]

# Build for production
npm run build

# Run built version
node dist/index.js [command]
```

---

## Project Structure

```
pet-gacha-cli/
+-- src/
|   +-- index.ts      # CLI entry point
|   +-- types.ts      # Type definitions
|   +-- gacha.ts      # Gacha mechanics
|   +-- sprites.ts    # ASCII art sprites
|   +-- display.ts    # Terminal display
|   +-- names.ts      # Name generation
|   +-- storage.ts    # Local storage
+-- dist/             # Compiled output
+-- docs/             # Documentation
```

---

## Questions?

Feel free to open an issue for any questions about contributing.

---

*Thank you for helping make Pet Gacha CLI better!*
