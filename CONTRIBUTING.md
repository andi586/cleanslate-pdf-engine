# Contributing to CleanSlate Protocol

Thank you for your interest in contributing to CleanSlate Protocol! This document provides guidelines and standards for contributors.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Convention](#commit-convention)
- [Priority Areas](#priority-areas)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful, inclusive, and harassment-free environment for everyone, regardless of experience level, gender, gender identity, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

---

## Getting Started

Before contributing, please take a moment to understand the project:

1. Read the [README.md](README.md) for project overview
2. Read the [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
3. Review the [ROADMAP.md](ROADMAP.md) for planned features
4. Check existing [Issues](https://github.com/andi586/cleanslate-pdf-engine/issues) and [Pull Requests](https://github.com/andi586/cleanslate-pdf-engine/pulls)

---

## Development Setup

### Prerequisites

Ensure you have the following installed on your system:

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ (recommended: 22.x) | JavaScript runtime |
| pnpm | 10+ | Package manager |
| Git | Latest | Version control |

### Setup Steps

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/cleanslate-pdf-engine.git
cd cleanslate-pdf-engine

# 3. Add upstream remote
git remote add upstream https://github.com/andi586/cleanslate-pdf-engine.git

# 4. Install dependencies
pnpm install

# 5. Start development server
pnpm dev

# 6. Open http://localhost:3000 in your browser
```

### Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with hot reload |
| `pnpm build` | Build production bundle |
| `pnpm check` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |

---

## How to Contribute

### Reporting Bugs

1. Search existing [Issues](https://github.com/andi586/cleanslate-pdf-engine/issues) to avoid duplicates
2. Create a new issue with the following information:
   - **Browser and version** (e.g., Chrome 120, Firefox 115)
   - **Operating system** (e.g., macOS 14, Windows 11, Ubuntu 22.04)
   - **File type and size** that triggered the bug
   - **Steps to reproduce** the issue
   - **Expected behavior** vs. **actual behavior**
   - **Screenshot or converted output** if applicable
3. If possible, attach the problematic document (redact sensitive content first)

### Suggesting Features

1. Open a new issue with the `feature-request` label
2. Describe the **use case** — what problem does this solve?
3. Explain the **expected behavior** — how should it work?
4. Provide **context** — why would this benefit the community?

### Submitting Code

1. Fork the repository and create a feature branch from `main`
2. Make your changes with clear, focused commits
3. Ensure TypeScript type checking passes: `pnpm check`
4. Test your changes manually in the browser
5. Submit a Pull Request with a clear description

---

## Pull Request Process

1. **Branch naming**: Use descriptive names like `feat/ocr-support`, `fix/table-column-alignment`, `docs/api-reference`
2. **PR description**: Clearly explain what the PR does, why it's needed, and how to test it
3. **Keep PRs focused**: One feature or fix per PR. Large PRs are harder to review
4. **Update documentation**: If your change affects user-facing behavior, update the relevant docs
5. **Respond to feedback**: Address review comments promptly and constructively

---

## Coding Standards

### TypeScript

- Use strict TypeScript — no `any` types unless absolutely necessary
- Define interfaces for all data structures
- Use descriptive variable and function names
- Keep functions focused — one function, one responsibility

### React

- Use functional components with hooks
- Avoid `useEffect` for derived state — use `useMemo` instead
- Keep components small and composable
- Use shadcn/ui components from `@/components/ui/` for consistency

### CSS / Tailwind

- Use Tailwind utility classes — avoid custom CSS unless necessary
- Follow the design system tokens defined in `index.css`
- Ensure responsive design — test on mobile, tablet, and desktop
- Maintain accessibility — visible focus rings, keyboard navigation, ARIA labels

---

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) for clear, automated changelog generation:

| Prefix | Usage | Example |
|--------|-------|---------|
| `feat:` | New feature | `feat: add OCR support for scanned PDFs` |
| `fix:` | Bug fix | `fix: correct table column alignment for 8+ columns` |
| `docs:` | Documentation | `docs: add API reference for CSP output format` |
| `refactor:` | Code refactoring | `refactor: extract heading detector into separate module` |
| `test:` | Tests | `test: add benchmark suite for financial PDFs` |
| `chore:` | Maintenance | `chore: update pdfjs-dist to latest version` |
| `perf:` | Performance | `perf: parallelize page processing with Web Workers` |
| `style:` | Code style | `style: fix indentation in pdf-engine.ts` |

---

## Priority Areas

The following areas have the highest impact and are where contributions are most needed:

### High Priority

- **PDF Engine improvements** (`client/src/lib/pdf-engine.ts`): Table detection for complex financial reports, multi-column layout support, code block detection
- **Test samples**: Real-world PDFs for benchmarking (financial reports, academic papers, government documents)
- **CJK support**: Japanese (Hiragana/Katakana), Korean (Hangul), Traditional Chinese edge cases

### Medium Priority

- **Protocol specification**: Help formalize the CSP v1.0 spec
- **Framework plugins**: LangChain, LlamaIndex, AutoGen integrations
- **Documentation**: Tutorials, API reference, migration guides

### Good First Issues

Look for issues labeled `good-first-issue` — these are specifically curated for new contributors and include clear descriptions of what needs to be done.

---

## Questions?

If you have questions about contributing, please:

- Open a [Discussion](https://github.com/andi586/cleanslate-pdf-engine/discussions) on GitHub
- Comment on the relevant Issue or PR

---

*Thank you for helping make document parsing better for everyone. Every contribution, no matter how small, makes a difference.*
