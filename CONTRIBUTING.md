# Contributing to CleanSlate Protocol

Thank you for your interest in contributing to CleanSlate Protocol! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

1. Check existing [Issues](https://github.com/andi586/cleanslate-pdf-engine/issues) to avoid duplicates
2. Use the Bug Report template when creating a new issue
3. Include: browser version, OS, file type, and steps to reproduce
4. Attach the problematic PDF/document if possible (redact sensitive content)

### Suggesting Features

1. Open a [Feature Request](https://github.com/andi586/cleanslate-pdf-engine/issues/new) issue
2. Describe the use case and expected behavior
3. Explain why this would benefit the community

### Submitting Code

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run type checking: `pnpm check`
5. Commit with clear messages: `git commit -m "feat: add table border detection"`
6. Push to your fork: `git push origin feature/your-feature-name`
7. Open a Pull Request against `main`

## Development Setup

```bash
git clone https://github.com/andi586/cleanslate-pdf-engine.git
cd cleanslate-pdf-engine
pnpm install
pnpm dev
```

Visit `http://localhost:3000` to see the app running.

## Project Structure

```
client/
  src/
    pages/
      Home.tsx        ← Landing page (CSP protocol showcase)
      Converter.tsx   ← CSP Playground (document converter)
    lib/
      pdf-engine.ts   ← v0.2 PDF parsing engine (core)
    components/       ← Reusable UI components
    index.css         ← Design system & theme
```

## Key Areas for Contribution

### PDF Engine (`client/src/lib/pdf-engine.ts`)

The core parsing engine. Priority improvements:

- **Table detection**: Improve column clustering for complex financial tables
- **Code block detection**: Identify monospace fonts (Courier, Consolas) for code formatting
- **Multi-column layout**: Detect and handle two-column academic papers
- **Header/footer filtering**: Better detection of repeating page headers

### CJK Support

- Japanese (Hiragana/Katakana) specific rules
- Korean (Hangul) spacing and line break rules
- Traditional Chinese variant handling

### Protocol Specification

- Help formalize the CSP v1.0 specification
- Write test cases for protocol validation
- Create reference implementations in Python/Go/Rust

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

## Questions?

Open a [Discussion](https://github.com/andi586/cleanslate-pdf-engine/discussions) or reach out via Issues.

---

Thank you for helping make document parsing better for everyone!
