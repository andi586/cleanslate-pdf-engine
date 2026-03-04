# CleanSlate Protocol — Development Roadmap

**Last Updated**: 2026-03-03

This document outlines the planned development trajectory for CleanSlate Protocol (CSP), organized into phases with clear milestones and deliverables.

---

## Phase 1: Foundation (Current — v0.1 to v0.2) ✅

**Status**: Complete

The foundation phase established the core product and protocol definition.

| Milestone | Status | Description |
|-----------|--------|-------------|
| PDF Engine v0.1 | ✅ Done | Basic text extraction via pdfjs-dist |
| PDF Engine v0.2 | ✅ Done | Font-clustering heading detection, spatial table analysis, CJK-Latin repair |
| CSP Protocol Definition | ✅ Done | Three-layer protocol (Raw → Semantic → Verification) |
| CSP Playground | ✅ Done | Browser-based interactive converter with three output modes |
| Landing Page | ✅ Done | Protocol showcase with architecture, code examples, ecosystem overview |
| 10+ Format Support | ✅ Done | PDF, DOCX, XLSX, PPTX, HTML, CSV, TXT, JSON, PNG, JPEG, MD |
| Open Source Release | ✅ Done | MIT License, GitHub repository, professional documentation |

---

## Phase 2: Engine Enhancement (v0.3 – v0.5)

**Timeline**: Q2 2026
**Focus**: Expand parsing capabilities and improve accuracy

### v0.3 — OCR & Code Detection

| Feature | Priority | Description |
|---------|----------|-------------|
| Tesseract.js WASM | High | Scanned PDF OCR support via browser-native Tesseract |
| Code Block Detection | High | Monospace font analysis (Courier, Consolas) for automatic code block wrapping |
| List Detection | Medium | Ordered/unordered list pattern recognition |
| Footnote Handling | Medium | Footnote detection and proper Markdown formatting |

### v0.4 — Advanced Layout

| Feature | Priority | Description |
|---------|----------|-------------|
| Multi-Column Layout | High | Two/three-column academic paper support |
| Header/Footer Filtering | High | Repeating page header/footer detection and removal |
| Image Extraction | Medium | Embedded image extraction with position mapping |
| Formula Detection | Low | Mathematical formula recognition (basic LaTeX output) |

### v0.5 — Quality & Performance

| Feature | Priority | Description |
|---------|----------|-------------|
| Accuracy Benchmark Suite | High | Standardized test suite with 50+ real-world PDFs |
| Performance Optimization | High | Web Worker parallelization for large documents |
| Streaming Processing | Medium | Progressive output for documents >100 pages |
| Error Recovery | Medium | Graceful handling of corrupted or malformed files |

---

## Phase 3: Ecosystem Integration (v0.6 – v0.9)

**Timeline**: Q3 2026
**Focus**: Build SDK packages and framework integrations

### v0.6 — SDK Packages

| Deliverable | Description |
|-------------|-------------|
| `@cleanslate/sdk` (npm) | JavaScript/TypeScript SDK for Node.js and browser |
| `cleanslate` (PyPI) | Python SDK with async support |
| CLI Tool | `npx cleanslate convert report.pdf --output csp` |

### v0.7 — AI Framework Plugins

| Integration | Description |
|-------------|-------------|
| LangChain Document Loader | `CleanSlateLoader` for LangChain's document loading pipeline |
| LlamaIndex Reader | `CleanSlateReader` for LlamaIndex's data ingestion |
| AutoGen Tool | CSP-compatible document tool for AutoGen agents |
| CrewAI Tool | Document parsing tool for CrewAI workflows |

### v0.8 — Developer Tools

| Tool | Description |
|------|-------------|
| VS Code Extension | In-editor document preview and conversion |
| GitHub Action | CI/CD integration for automated document processing |
| CSP Validator | Online and CLI tool for validating CSP output compliance |

### v0.9 — API Layer

| Feature | Description |
|---------|-------------|
| REST API Wrapper | Self-hostable API server for server-side deployment |
| WebSocket Streaming | Real-time conversion progress for large documents |
| Batch Processing | Queue-based multi-document processing |

---

## Phase 4: Protocol Standardization (v1.0)

**Timeline**: Q4 2026
**Focus**: Formalize the protocol and establish governance

| Milestone | Description |
|-----------|-------------|
| CSP v1.0 Specification | Complete formal specification document |
| RFC Draft | Submit CSP as an Internet-Draft for community review |
| Reference Implementations | Official implementations in JavaScript, Python, Go, Rust |
| Conformance Test Suite | Automated tests for protocol compliance verification |
| Protocol Governance | Establish open governance model for protocol evolution |

---

## Phase 5: Enterprise & Scale (v1.5+)

**Timeline**: 2027
**Focus**: Enterprise features and platform expansion

| Feature | Description |
|---------|-------------|
| Enterprise Self-Hosted | On-premise deployment with SSO, audit logs, compliance |
| Real-Time Collaboration | Multi-user collaborative document processing |
| Multi-Modal Support | Audio transcripts, video subtitles, presentation slides |
| Edge Deployment | Lightweight runtime for IoT and embedded systems |
| Protocol Extensions | Domain-specific extensions (legal, medical, financial) |
| Marketplace | Community-contributed parsers, plugins, and templates |

---

## Community Contribution Priorities

The following areas are where community contributions would have the highest impact:

| Area | Impact | Difficulty | Description |
|------|--------|-----------|-------------|
| PDF Test Samples | Very High | Easy | Real-world PDFs for benchmarking (redacted if needed) |
| CJK Edge Cases | High | Medium | Japanese, Korean, Traditional Chinese specific rules |
| Table Detection | High | Hard | Complex financial table and multi-header table support |
| Protocol Spec Writing | High | Medium | Help formalize the CSP v1.0 specification |
| Framework Plugins | Medium | Medium | LangChain, LlamaIndex, AutoGen integrations |
| Language SDKs | Medium | Medium | Go, Rust, Java SDK implementations |

---

## How to Participate

1. **Star the repository** to show support and track updates
2. **Open an issue** to report bugs or suggest features
3. **Submit a PR** for any roadmap item you'd like to work on
4. **Join Discussions** to shape the protocol's future direction

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

---

*This roadmap is a living document and will be updated as the project evolves. Priorities may shift based on community feedback and ecosystem needs.*
