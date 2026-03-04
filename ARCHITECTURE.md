# CleanSlate Protocol — Technical Architecture

**Version**: v0.2
**Last Updated**: 2026-03-03

---

## Overview

CleanSlate Protocol (CSP) is architected as a **browser-native document standardization pipeline** with a modular, layered design. The system transforms unstructured documents into a three-layer structured output (Raw Extraction → Semantic Structure → Verification) entirely within the browser runtime, requiring zero server-side processing.

This document provides a comprehensive technical deep-dive into the system's architecture, data flow, core algorithms, and extension points.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser Runtime                          │
│                                                                 │
│  ┌─────────────┐                                               │
│  │  User Input  │  Drag & Drop / File Picker / Paste           │
│  └──────┬──────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐   ┌──────────────────────────────────────┐   │
│  │  FileReader  │──▶│         Format Dispatcher            │   │
│  │  API         │   │  PDF │ DOCX │ XLSX │ HTML │ CSV │ …  │   │
│  └─────────────┘   └──────────────┬───────────────────────┘   │
│                                    │                            │
│                    ┌───────────────▼───────────────┐           │
│                    │     Format-Specific Parser     │           │
│                    │                               │           │
│                    │  PDF: pdfjs-dist + v0.2 Engine │           │
│                    │  DOCX: JSZip + XML Parser      │           │
│                    │  XLSX: SheetJS                  │           │
│                    │  HTML: DOMParser                │           │
│                    │  CSV/TXT/JSON: Built-in         │           │
│                    └───────────────┬───────────────┘           │
│                                    │                            │
│                    ┌───────────────▼───────────────┐           │
│                    │     CSP Protocol Builder       │           │
│                    │                               │           │
│                    │  Layer 1: Raw Extraction       │           │
│                    │  Layer 2: Semantic Structure   │           │
│                    │  Layer 3: Verification         │           │
│                    └───────────────┬───────────────┘           │
│                                    │                            │
│                    ┌───────────────▼───────────────┐           │
│                    │     Output Renderer            │           │
│                    │  Markdown │ CSP JSON │ Raw JSON │           │
│                    └──────────────────────────────┘            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## PDF Engine v0.2 — Core Algorithm Design

The PDF engine (`client/src/lib/pdf-engine.ts`) is the most complex module in the system, implementing a three-stage processing pipeline.

### Stage 1: Structure Layer

The structure layer is responsible for detecting headings, determining hierarchy levels, and identifying page structure.

**Heading Detection Algorithm**:

1. Extract all text items from pdfjs-dist with position, font size, and font name metadata
2. Group items into logical lines using Y-coordinate tolerance clustering (±2.5px)
3. Build a font-size frequency distribution across all lines
4. Identify the **body font size** as the most frequent font size (statistical mode)
5. Any line with font size significantly larger than body font size is classified as a heading candidate
6. Heading level is assigned by sorting unique heading font sizes in descending order (largest = H1)
7. Additional heuristics detect **numbered headings** (e.g., "1. Introduction"), **bold sub-headings**, and **ALL-CAPS headings**

**Key Parameters**:

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `LINE_Y_TOLERANCE` | 2.5px | Maximum Y-distance for same-line grouping |
| `PARAGRAPH_LINE_GAP_FACTOR` | 1.8x | Gap threshold for paragraph break detection |
| Bold heading max length | 50 chars | Prevents body text misclassification |
| Bold heading max words | 8 words | Additional guard against false positives |

### Stage 2: Table Layer

The table layer detects tabular data structures using spatial analysis of text item positions.

**Column Detection Algorithm**:

1. Collect all X-coordinates of text items across candidate lines
2. Sort X-coordinates and cluster them using gap-based segmentation (`COLUMN_GAP_THRESHOLD = 25px`)
3. Filter clusters by minimum occurrence count (≥30% of candidate lines must share the cluster)
4. Validate: require ≥3 columns and ≥3 consecutive table-like rows
5. Cross-validate column gaps: at least one inter-column gap must exceed 5px
6. Assign each text item to its nearest column based on X-coordinate proximity

**Table Validation Rules**:

| Rule | Threshold | Purpose |
|------|-----------|---------|
| Minimum columns | 3 | Prevents paragraph misclassification |
| Minimum rows | 3 | Ensures statistical significance |
| Column gap minimum | 5px | Validates genuine column separation |
| Cluster size minimum | 30% of lines | Ensures consistent column alignment |

### Stage 3: Text Layer

The text layer handles line break repair, CJK-Latin spacing, and OCR artifact cleanup.

**Line Break Repair Logic**:

The algorithm determines whether consecutive lines should be merged into a single paragraph based on:

1. **Hyphen continuation**: Lines ending with `[a-zA-Z]-` are always merged (hyphenated word break)
2. **CJK continuation**: Adjacent CJK characters across line breaks are merged without space
3. **Sentence termination**: Lines ending with `.!?。！？` are NOT merged (paragraph boundary)
4. **Line width heuristic**: Lines extending beyond 400px width are likely mid-paragraph breaks
5. **Lowercase continuation**: Lines ending with `[a-z,]` followed by lines starting with `[a-z]` are merged

**CJK-Latin Spacing**:

Automatically inserts a single space between CJK characters and Latin characters/digits where missing, following standard Chinese typographic conventions.

**OCR Artifact Cleanup**:

Normalizes common OCR errors including ligature characters (ﬁ→fi, ﬂ→fl), smart quotes, em/en dashes, zero-width characters, and misplaced CJK punctuation spacing.

---

## Frontend Architecture

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.2 |
| Styling | Tailwind CSS | 4.1 |
| Build Tool | Vite | 7.1 |
| UI Components | shadcn/ui | Latest |
| Animation | Framer Motion | 12.x |
| Routing | Wouter | 3.x |
| PDF Parsing | pdfjs-dist | Latest |
| Language | TypeScript | 5.6 |

### Design System

The visual design follows a **Wabi-Sabi (侘寂)** aesthetic philosophy — finding beauty in imperfection and simplicity:

| Token | Value | Intent |
|-------|-------|--------|
| Background | `#FAFAF5` (warm white) | Paper-like warmth, not clinical white |
| Foreground | `#1A1A2E` (deep ink) | High contrast, authoritative |
| Primary | `#16537E` (indigo) | Trust, depth, professionalism |
| Display Font | Playfair Display | Elegant serif for headings |
| Body Font | Source Sans 3 | Clean, readable sans-serif |
| Code Font | Fira Code | Monospace with ligatures |

---

## Extension Points

The architecture provides clear extension points for future development:

1. **Format Parsers**: Add new document format support by implementing a parser function that returns structured text items
2. **Engine Plugins**: The PDF engine's three-stage pipeline (Structure → Table → Text) can be extended with additional stages (e.g., image extraction, formula detection)
3. **Output Formats**: New output renderers can be added alongside Markdown/CSP/Raw JSON (e.g., HTML, LaTeX, reStructuredText)
4. **Protocol Layers**: The CSP protocol is designed to accommodate additional layers (e.g., Layer 4: Semantic Enrichment via LLM)

---

## Security Model

CleanSlate's security model is based on a fundamental principle: **data never leaves the browser**.

| Aspect | Implementation |
|--------|---------------|
| Data Processing | 100% client-side JavaScript/WASM |
| Network Calls | Zero — no API calls, no telemetry, no analytics on document content |
| File Access | Browser FileReader API only — no filesystem access |
| Dependencies | pdfjs-dist runs in browser; no server-side PDF processing |
| Verification | SHA-256 checksums computed locally; Merkle trees built in-browser |

---

*For questions about the architecture, please open a [Discussion](https://github.com/andi586/cleanslate-pdf-engine/discussions) on GitHub.*
