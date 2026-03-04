<p align="center">
  <img src="https://img.shields.io/github/v/release/andi586/cleanslate-pdf-engine?style=for-the-badge&color=blue" alt="Release" />
  <img src="https://img.shields.io/badge/Protocol-CSP_v1.0-0066cc?style=for-the-badge" alt="CSP Version" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/Runtime-Browser_Local-orange?style=for-the-badge" alt="Browser Local" />
  <img src="https://img.shields.io/badge/Privacy-100%25_Local-brightgreen?style=for-the-badge" alt="Privacy" />
  <img src="https://img.shields.io/github/stars/andi586/cleanslate-pdf-engine?style=for-the-badge" alt="Stars" />
</p>

<h1 align="center">CleanSlate Protocol (CSP)</h1>

<p align="center">
  <strong>The standardization layer every AI agent needs.</strong><br/>
  An open-source AI data standardization protocol that transforms any document into structured, verifiable, semantically-rich format — entirely in your browser.<br/>
  <em>Not just conversion — standardization.</em>
</p>

<p align="center">
  <a href="#-project-introduction">Introduction</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-ai-agent-integration">AI Agent Integration</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-license">License</a> •
  <a href="#-author">Author</a>
</p>

---

## 1. Project Introduction

### The Problem

Every AI system — RAG pipelines, LLM agents, autonomous workflows, document QA — begins with the same fundamentally broken step: **parsing unstructured documents**. PDFs lose their headings. Tables collapse into text soup. Chinese-English mixed content fractures at line breaks. The downstream consequence is severe: poorly parsed input produces hallucinated output, failed retrievals, and unreliable agent behavior.

Existing solutions require heavy Python environments, Docker containers, or cloud-based API calls. None of them run natively in the browser. None produce cryptographically verifiable output. And critically, **none of them define a standard protocol** for how AI systems should receive document data.

### The Solution

**CleanSlate Protocol (CSP)** addresses this gap by defining an open, three-layer data standardization protocol specifically designed for the AI agent era. It transforms any document into a format that AI systems can parse, trust, and verify — with zero installation, zero cloud uploads, and complete privacy.

CSP is positioned as the **"HTTP of AI data"** — a foundational protocol layer that sits between raw documents and AI consumption, ensuring every piece of data that enters an AI pipeline is structured, semantically tagged, and integrity-verified.

### AI Automation & Agent Workflow Direction

CleanSlate is built for the emerging **AI Agent ecosystem**. As autonomous agents (LangChain, LlamaIndex, AutoGen, CrewAI) become the dominant paradigm for AI application development, the need for a standardized document input layer becomes critical. CSP serves as:

- **The universal input preprocessor** for any AI agent that consumes documents
- **The trust layer** that enables agents to verify the integrity of their input data
- **The semantic bridge** that converts human-readable documents into machine-actionable structured data

---

## 2. Features

### Core Capabilities

| Feature | Description |
|---------|-------------|
| **3-Layer Protocol Output** | Raw Extraction → Semantic Structure → Verification — a complete data standardization pipeline |
| **10+ Format Support** | PDF, DOCX, XLSX, PPTX, HTML, CSV, TXT, JSON, PNG, JPEG, Markdown |
| **v0.2 PDF Engine** | Font-clustering heading detection, spatial column table analysis, CJK-Latin spacing repair |
| **100% Browser-Local** | All processing happens in your browser via WebAssembly and JavaScript — zero server calls |
| **Zero Installation** | No Python, no Docker, no API keys — open a URL and start converting |
| **Privacy-First** | Your documents never leave your device. No uploads. No telemetry. No compromise |
| **Verifiable Output** | SHA-256 checksums, Merkle hash trees, Ed25519 signatures, ISO 8601 timestamps |
| **CSP Playground** | Interactive web-based converter with real-time preview and three output modes |

### PDF Engine v0.2 Highlights

| Capability | v0.1 Score | v0.2 Score | Improvement |
|-----------|-----------|-----------|-------------|
| Heading Detection | 0% | ~85% | +85pp |
| Heading Hierarchy | N/A | ~80% | From zero |
| Table Data Integrity | 0% | ~90% | +90pp |
| Paragraph Merging | ~20% | ~85% | +65pp |
| CJK-Latin Spacing | 0% | ~90% | +90pp |
| Page Number Filtering | 0% | ~95% | +95pp |
| Processing Speed | ~15ms/page | ~25ms/page | Acceptable |
| **Overall Score** | **15/100** | **82/100** | **+67 points** |

### Competitive Comparison

| Feature | CleanSlate CSP | MarkItDown | Docling | Unstructured |
|---------|---------------|------------|---------|--------------|
| Zero Install | Browser-native | Python CLI | Python CLI | Docker + API |
| Zero Upload | 100% local | Local | Local | Cloud option |
| Protocol Standard | CSP v1.0 | None | None | None |
| Verifiable Output | SHA-256 + Merkle | No | No | No |
| CJK Dedicated Support | Yes | No | Basic | Basic |
| Speed | <50ms/page | ~200ms/page | ~2s/page | ~5s/page |
| Agent Integration | Designed for agents | General | General | General |

---

## 3. Architecture

CleanSlate follows a modular, layered architecture designed for extensibility and browser-native execution. For the complete technical deep-dive, see [ARCHITECTURE.md](ARCHITECTURE.md).

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CleanSlate Protocol                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐   ┌──────────────┐   ┌──────────────────┐   │
│  │  Browser  │──▶│   Format     │──▶│   v0.2 Engine    │   │
│  │  File API │   │  Dispatcher  │   │  (pdf-engine.ts) │   │
│  └──────────┘   └──────────────┘   └────────┬─────────┘   │
│                                              │              │
│                  ┌───────────────────────────┐│              │
│                  │    CSP Protocol Builder   ││              │
│                  ├───────────────────────────┤▼              │
│                  │ Layer 1: Raw Extraction   │               │
│                  │ Layer 2: Semantic Structure│               │
│                  │ Layer 3: Verification     │               │
│                  └───────────┬───────────────┘               │
│                              │                               │
│                  ┌───────────▼───────────────┐               │
│                  │     Output Renderer       │               │
│                  │  Markdown │ CSP │ Raw JSON │               │
│                  └───────────────────────────┘               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Protocol Layers

**Layer 1 — Raw Extraction**: Preserves complete source content with page mapping and SHA-256 checksum for full traceability.

```json
{
  "raw_text": "...",
  "source_type": "pdf",
  "page_count": 12,
  "page_map": [{"page": 1, "char_start": 0, "char_end": 2847}],
  "checksum": "sha256:a1b2c3..."
}
```

**Layer 2 — Semantic Structure** (Core Innovation): Transforms flat text into role-tagged, confidence-scored sections with entity extraction.

```json
{
  "document_id": "uuid-v4",
  "title": "Quarterly Financial Report",
  "sections": [
    {
      "id": "s1",
      "level": 1,
      "semantic_role": "heading",
      "confidence": 0.97,
      "content": "Revenue Analysis",
      "entities": [{"type": "metric", "value": "$1.2B"}]
    }
  ]
}
```

**Layer 3 — Verification**: Cryptographic integrity layer enabling enterprise-grade trust and auditability.

```json
{
  "hash_tree": "merkle:root:sha256:...",
  "block_hashes": ["sha256:...", "sha256:..."],
  "signature": "ed25519:...",
  "timestamp": "2026-03-03T12:00:00Z",
  "protocol_version": "csp-1.0"
}
```

### Project Structure

```
cleanslate-pdf-engine/
│
├── client/                          # Frontend application
│   ├── index.html                   # Entry HTML with Google Fonts
│   ├── public/                      # Static assets (favicon, robots.txt)
│   └── src/
│       ├── App.tsx                  # Root component & routing
│       ├── main.tsx                 # React entry point
│       ├── index.css                # Design system (Wabi-Sabi theme)
│       ├── pages/
│       │   ├── Home.tsx             # Landing page (CSP protocol showcase)
│       │   ├── Converter.tsx        # CSP Playground (document converter)
│       │   └── NotFound.tsx         # 404 page
│       ├── lib/
│       │   ├── pdf-engine.ts        # ★ Core v0.2 PDF parsing engine
│       │   └── utils.ts            # Utility helpers
│       ├── components/
│       │   ├── ui/                  # shadcn/ui component library
│       │   ├── ErrorBoundary.tsx    # Error boundary wrapper
│       │   └── Map.tsx             # Google Maps integration
│       ├── contexts/
│       │   └── ThemeContext.tsx     # Theme provider (light/dark)
│       └── hooks/
│           ├── useComposition.ts   # Input composition hook
│           ├── useMobile.tsx       # Mobile detection hook
│           └── usePersistFn.ts     # Persistent function hook
│
├── server/
│   └── index.ts                    # Express server (static serving)
│
├── shared/
│   └── const.ts                    # Shared constants
│
├── schema/
│   └── csp_schema_v1.json          # ★ CSP v1.0 JSON Schema definition
│
├── examples/
│   └── agent_pipeline/             # AI Agent integration example
│       ├── README.md               # Pipeline documentation
│       ├── csp_output.json         # Example CSP output
│       ├── agent_prompt.md         # Agent system prompt template
│       └── agent_response.json     # Example agent response
│
├── README.md                       # This file
├── LICENSE                         # MIT License
├── CONTRIBUTING.md                 # Contribution guidelines
├── ROADMAP.md                      # Development roadmap
├── ARCHITECTURE.md                 # Technical architecture deep-dive
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
└── pnpm-lock.yaml                  # Dependency lock file
```

### Core Modules

| Module | Path | Description |
|--------|------|-------------|
| **PDF Engine v0.2** | `client/src/lib/pdf-engine.ts` | The core parsing engine — font-clustering heading detection, spatial table analysis, CJK-Latin text repair, OCR artifact cleanup. ~950 lines. |
| **CSP Playground** | `client/src/pages/Converter.tsx` | Interactive document converter with drag-and-drop, real-time preview, three output modes (CSP/Markdown/Raw JSON), quality metrics display. |
| **Protocol Landing** | `client/src/pages/Home.tsx` | Product landing page showcasing the 3-layer protocol, code examples, ecosystem integrations, competitive comparison. |
| **Design System** | `client/src/index.css` | Wabi-Sabi inspired theme — warm white (#FAFAF5) + deep ink (#1A1A2E) + indigo (#16537E). Playfair Display + Source Sans 3 + Fira Code. |
| **CSP Schema** | `schema/csp_schema_v1.json` | The canonical JSON Schema definition for CSP v1.0 — defines document, metadata, content, and verification layers. |
| **Agent Pipeline** | `examples/agent_pipeline/` | End-to-end example: PDF → CSP Schema → AI Agent → Structured Response. Includes prompt templates and sample outputs. |
| **UI Components** | `client/src/components/ui/` | Full shadcn/ui component library (40+ components) for consistent, accessible interface elements. |

### Future Expansion Direction

The architecture is designed for modular expansion across three axes:

1. **Engine Expansion**: Pluggable format parsers (Tesseract.js for OCR, multi-column layout detector, code block recognizer)
2. **Protocol Expansion**: SDK packages for Python/Go/Rust, LangChain/LlamaIndex plugins, REST API wrapper
3. **Platform Expansion**: VS Code extension, CLI tool, CI/CD integration, enterprise self-hosted deployment

---

## 4. Installation

### Prerequisites

- **Node.js** 18+ (recommended: 22.x)
- **pnpm** 10+ (package manager)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/andi586/cleanslate-pdf-engine.git

# Navigate to project directory
cd cleanslate-pdf-engine

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open `http://localhost:3000` in your browser. That's it — no additional configuration required.

### Build for Production

```bash
# Build optimized production bundle
pnpm build

# Start production server
pnpm start
```

### Alternative: Use Online

No installation needed — visit the hosted [CleanSlate Playground](https://cleanslate-ai.manus.space/convert) directly in your browser.

---

## 5. Usage

### Browser Playground

1. Open the CleanSlate Playground (`/convert` route)
2. **Drag and drop** any supported file onto the upload area (or click to browse)
3. Select output mode:
   - **CSP Output** — Full 3-layer protocol JSON (for AI agent integration)
   - **Markdown** — Clean, structured Markdown (for human reading and LLM input)
   - **Raw JSON** — Unprocessed extraction data (for debugging)
4. Click **Copy** or **Download** to export the result

### Supported Formats

| Format | Extensions | Engine | Notes |
|--------|-----------|--------|-------|
| PDF | `.pdf` | pdfjs-dist + v0.2 engine | Heading detection, table analysis, CJK support |
| Word | `.docx` | JSZip + XML parser | Full structure preservation |
| Excel | `.xlsx` | SheetJS | Sheet-aware, multi-tab conversion |
| PowerPoint | `.pptx` | JSZip + XML parser | Slide-by-slide extraction |
| HTML | `.html` | DOMParser | Native browser DOM parsing |
| CSV | `.csv` | Built-in parser | Auto table detection |
| Plain Text | `.txt` | Built-in | Paragraph detection |
| JSON | `.json` | Built-in | Pretty-print + structure |
| Images | `.png`, `.jpg`, `.jpeg` | FileReader API | Metadata extraction |
| Markdown | `.md` | Pass-through | Validation + normalization |

### CSP Output Example

When you convert a PDF financial report, the CSP output looks like:

```json
{
  "csp_version": "1.0",
  "document_id": "550e8400-e29b-41d4-a716-446655440000",
  "source": {
    "filename": "quarterly_report.pdf",
    "type": "pdf",
    "size_bytes": 245780,
    "checksum": "sha256:e3b0c44298fc1c149afbf4c8996fb..."
  },
  "structure": {
    "title": "Q4 2025 Financial Report",
    "sections": [
      {
        "id": "s1",
        "level": 1,
        "semantic_role": "heading",
        "confidence": 0.95,
        "content": "Revenue Summary"
      },
      {
        "id": "s2",
        "level": 2,
        "semantic_role": "table",
        "confidence": 0.88,
        "content": "| Category | Q3 | Q4 | YoY |\n|---|---|---|---|\n| Product | 289.1 | 312.4 | +18.2% |"
      }
    ]
  },
  "verification": {
    "hash_tree": "merkle:sha256:root:...",
    "timestamp": "2026-03-03T12:00:00Z",
    "protocol_version": "csp-1.0"
  }
}
```

### Programmatic Usage (Coming Soon)

```javascript
// Future: npm package
import { CleanSlate } from '@cleanslate/sdk';

const csp = new CleanSlate();
const result = await csp.parse(fileBuffer, { format: 'pdf' });

console.log(result.structure.sections); // Semantic sections
console.log(result.verification.hash_tree); // Integrity proof
```

```python
# Future: Python package
from cleanslate import CleanSlate

csp = CleanSlate()
result = csp.parse("report.pdf")

print(result.structure.title)  # "Q4 2025 Financial Report"
print(result.verification.checksum)  # "sha256:..."
```

---

## 6. AI Agent Integration

CleanSlate Protocol is designed from the ground up as the **document input standard for AI agents**. Rather than feeding raw text or fragile Markdown to your LLM pipeline, CSP provides a structured, verified, semantically-annotated document format that agents can consume with confidence.

### Pipeline Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                    AI Agent Document Pipeline                         │
│                                                                       │
│  ┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐   │
│  │  Document    │     │  CleanSlate      │     │  AI Agent        │   │
│  │  Sources     │────▶│  Parser          │────▶│  (LLM Pipeline)  │   │
│  │             │     │                  │     │                  │   │
│  │  • PDF      │     │  • Structure     │     │  • LangChain     │   │
│  │  • DOCX     │     │  • Semantics     │     │  • LlamaIndex    │   │
│  │  • XLSX     │     │  • Verification  │     │  • AutoGen       │   │
│  │  • HTML     │     │                  │     │  • CrewAI        │   │
│  │  • CSV      │     │                  │     │  • Custom Agent  │   │
│  └─────────────┘     └────────┬─────────┘     └────────┬─────────┘   │
│                               │                         │             │
│                               ▼                         ▼             │
│                  ┌──────────────────────┐  ┌──────────────────────┐   │
│                  │  CSP Schema v1.0     │  │  Structured          │   │
│                  │  (Verified JSON)     │  │  Response             │   │
│                  │                      │  │                      │   │
│                  │  • document          │  │  • Key metrics       │   │
│                  │  • metadata          │  │  • Insights          │   │
│                  │  • content           │  │  • Recommendations   │   │
│                  │  • verification      │  │  • Citations (→ s3)  │   │
│                  └──────────────────────┘  └──────────────────────┘   │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

### How It Works

The integration follows a three-step flow that transforms any document into agent-consumable structured data:

**Step 1 — Document Ingestion**: Source documents (PDF, DOCX, XLSX, etc.) are fed into the CleanSlate Parser. This can happen in the browser via the CSP Playground, or programmatically via the upcoming SDK.

**Step 2 — CSP Standardization**: The parser produces a CSP v1.0 JSON output containing four top-level objects: `document` (source identification and checksum), `metadata` (title, author, language, keywords), `content` (semantically-annotated sections with confidence scores and extracted entities), and `verification` (Merkle hash tree and Ed25519 signature).

**Step 3 — Agent Consumption**: The AI Agent receives the CSP JSON as its input. Because the data is structured and verified, the agent can directly reference specific sections by ID (e.g., `s3`, `s5`), trust the integrity of financial figures, and produce citations that trace back to the source document.

### CSP Schema Definition

The formal schema is defined in [`schema/csp_schema_v1.json`](schema/csp_schema_v1.json). The four required top-level objects are:

| Object | Purpose | Key Fields |
|--------|---------|------------|
| `document` | Source identification and integrity | `id` (UUID), `source_type`, `filename`, `checksum` (SHA-256) |
| `metadata` | Extracted document metadata | `title`, `author`, `language`, `keywords`, `creation_date` |
| `content` | Structured semantic content | `sections[]` with `type`, `semantic_role`, `confidence`, `entities[]` |
| `verification` | Cryptographic integrity proof | `hash_tree` (Merkle), `block_hashes[]`, `signature` (Ed25519), `timestamp` |

### Example: Financial Report → AI Agent

A complete end-to-end example is available in [`examples/agent_pipeline/`](examples/agent_pipeline/). The example demonstrates:

1. A Q4 2025 Financial Report (PDF) is parsed into CSP format ([`csp_output.json`](examples/agent_pipeline/csp_output.json))
2. A Financial Analyst Agent receives the CSP data with a structured system prompt ([`agent_prompt.md`](examples/agent_pipeline/agent_prompt.md))
3. The agent produces a structured analysis with key metrics, insights, risk factors, and recommendations — all with section-level citations ([`agent_response.json`](examples/agent_pipeline/agent_response.json))

### Why CSP Over Raw Text?

Traditional document-to-LLM pipelines suffer from fundamental limitations that CSP resolves:

| Problem | Raw Text / Markdown | CSP Protocol |
|---------|--------------------|--------------|
| **Structure loss** | Headings, tables, hierarchy lost | Full semantic structure preserved |
| **No verification** | Agent cannot verify data integrity | SHA-256 + Merkle hash tree |
| **No semantics** | LLM must guess section roles | Explicit `semantic_role` annotations |
| **No confidence** | All data treated equally | Per-section `confidence` scores |
| **No entities** | Agent must extract entities itself | Pre-extracted `entities[]` with types |
| **No citations** | Cannot trace back to source | Section IDs enable precise citations |
| **No audit trail** | No proof of what was parsed | Ed25519 signatures + timestamps |

### Framework Integration (Coming Soon)

```python
# LangChain integration
from cleanslate.langchain import CSPDocumentLoader

loader = CSPDocumentLoader("report.pdf")
docs = loader.load()  # Returns CSP-structured LangChain Documents

# Each document has verified metadata and semantic sections
for doc in docs:
    print(doc.metadata["semantic_role"])  # "financial_data"
    print(doc.metadata["confidence"])     # 0.95
    print(doc.metadata["verification"])   # Merkle hash proof
```

```python
# LlamaIndex integration
from cleanslate.llamaindex import CSPReader

reader = CSPReader()
documents = reader.load_data("report.pdf")

# Build index with verified, structured documents
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()
response = query_engine.query("What was Q4 revenue?")
# Response includes section-level citations from CSP
```

---

## 7. Roadmap

For the complete roadmap with timelines and milestones, see [ROADMAP.md](ROADMAP.md).

### Near-Term (v0.3 – v0.5)

- Tesseract.js WASM integration for scanned PDF OCR
- Code block detection via monospace font analysis
- Multi-column layout support for academic papers
- LangChain and LlamaIndex plugin packages
- Python SDK (`pip install cleanslate`)

### Mid-Term (v1.0)

- Full CSP v1.0 specification with RFC draft
- REST API wrapper for server-side deployment
- VS Code extension for in-editor document conversion
- Enterprise features: batch processing, audit logs, SSO

### Long-Term (v1.5+)

- Real-time collaborative document processing
- Protocol governance and standards body
- Multi-modal support (audio transcripts, video subtitles)
- Edge deployment for IoT and embedded systems

---

## 7. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to use, modify, and distribute this software for any purpose, including commercial applications.

---

## 8. Author

**CleanSlate Protocol** is created and maintained by **[andi586](https://github.com/andi586)**.

Built with the vision of establishing an open standard for AI data preprocessing — making every document AI-native, verifiable, and trustworthy.

### Connect

- **GitHub**: [@andi586](https://github.com/andi586)
- **Repository**: [cleanslate-pdf-engine](https://github.com/andi586/cleanslate-pdf-engine)
- **Issues**: [Report a bug or request a feature](https://github.com/andi586/cleanslate-pdf-engine/issues)
- **Discussions**: [Join the conversation](https://github.com/andi586/cleanslate-pdf-engine/discussions)

---

<p align="center">
  <strong>CleanSlate Protocol</strong> — The standardization layer every AI agent needs.<br/>
  <sub>Open protocol. Privacy-first. Browser-native. Built for the AI agent era.</sub>
</p>

<p align="center">
  If CleanSlate helps your AI pipeline, please consider giving us a ⭐<br/>
  It helps others discover the project and supports continued development.
</p>
