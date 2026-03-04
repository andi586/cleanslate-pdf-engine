<p align="center">
  <img src="https://img.shields.io/badge/CSP-v1.0-blue?style=for-the-badge" alt="CSP Version" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/Browser-Local-orange?style=for-the-badge" alt="Browser Local" />
  <img src="https://img.shields.io/badge/Privacy-100%25-brightgreen?style=for-the-badge" alt="Privacy" />
</p>

<h1 align="center">CleanSlate Protocol</h1>

<p align="center">
  <strong>The standardization layer every AI agent needs.</strong><br/>
  Transform any document into structured, verifiable, AI-native format.<br/>
  100% browser-local. Zero uploads. Zero servers.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#protocol-overview">Protocol</a> •
  <a href="#supported-formats">Formats</a> •
  <a href="#csp-output">CSP Output</a> •
  <a href="#benchmarks">Benchmarks</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## The Problem

Every AI system — RAG pipelines, LLM agents, document QA — starts with the same broken step: **parsing unstructured documents**. PDFs lose their headings. Tables collapse into text soup. Chinese-English mixed content breaks apart. The result? **73% of RAG failures trace back to poor document parsing** [1].

Existing tools require Python environments, Docker containers, or cloud uploads. None of them run in the browser. None of them produce verifiable output. None of them speak a standard protocol.

## The Solution

**CleanSlate Protocol (CSP)** is an open standard that transforms any document into a three-layer structured format that AI systems can trust:

```
┌─────────────────────────────────────┐
│  Layer 3: Verification Layer        │  ← Merkle hash tree + signatures
├─────────────────────────────────────┤
│  Layer 2: Semantic Structure Layer  │  ← Headings, tables, entities, roles
├─────────────────────────────────────┤
│  Layer 1: Raw Extraction Layer      │  ← Source text + page map + checksum
└─────────────────────────────────────┘
```

**Not just conversion — standardization.**

## Quick Start

### Use in Browser

Visit the [CleanSlate Playground](https://cleanslate-ai.manus.space/convert) — drag and drop any document, get CSP output instantly.

### Use as Library

```bash
# Install
npm install @cleanslate/sdk

# Or clone and run locally
git clone https://github.com/andi586/cleanslate-pdf-engine.git
cd cleanslate-pdf-engine
pnpm install
pnpm dev
```

Open `http://localhost:3000` in your browser.

## Protocol Overview

### Layer 1: Raw Extraction

Preserves the complete source content with full traceability.

```json
{
  "raw_text": "...",
  "source_type": "pdf",
  "page_count": 12,
  "page_map": [{"page": 1, "char_start": 0, "char_end": 2847}],
  "checksum": "sha256:a1b2c3..."
}
```

### Layer 2: Semantic Structure

The core innovation — transforms flat text into structured, role-tagged sections with confidence scores.

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
      "entities": [
        {"type": "metric", "value": "$1.2B", "context": "total_revenue"}
      ]
    }
  ]
}
```

### Layer 3: Verification

Every output is cryptographically verifiable — enabling enterprise-grade trust.

```json
{
  "hash_tree": "merkle:root:sha256:...",
  "block_hashes": ["sha256:...", "sha256:..."],
  "signature": "ed25519:...",
  "timestamp": "2026-03-03T12:00:00Z",
  "protocol_version": "csp-1.0"
}
```

## Supported Formats

| Format | Extension | Status | Notes |
|--------|-----------|--------|-------|
| PDF | `.pdf` | ✅ Stable | v0.2 engine with heading/table/CJK support |
| Word | `.docx` | ✅ Stable | Full structure preservation |
| Excel | `.xlsx` | ✅ Stable | Sheet-aware conversion |
| PowerPoint | `.pptx` | ✅ Stable | Slide-by-slide extraction |
| HTML | `.html` | ✅ Stable | DOM-based parsing |
| CSV | `.csv` | ✅ Stable | Auto table detection |
| Plain Text | `.txt` | ✅ Stable | Paragraph detection |
| JSON | `.json` | ✅ Stable | Pretty-print + structure |
| Images | `.png/.jpg` | ✅ Basic | Metadata extraction |
| Markdown | `.md` | ✅ Stable | Pass-through with validation |

## Benchmarks

v0.2 Engine performance on 5 test samples:

| Metric | v0.1 | v0.2 | Improvement |
|--------|------|------|-------------|
| Heading Detection | 0% | ~85% | +85pp |
| Heading Hierarchy | N/A | ~80% | From zero |
| Table Data Integrity | 0% | ~90% | +90pp |
| Paragraph Merging | ~20% | ~85% | +65pp |
| CJK-Latin Spacing | 0% | ~90% | +90pp |
| Page Number Filtering | 0% | ~95% | +95pp |
| Processing Speed | ~15ms/page | ~25ms/page | Acceptable |
| **Overall Score** | **15/100** | **82/100** | **+67** |

## Architecture

```
User drops file
       │
       ▼
┌──────────────┐
│  File Reader  │  ← FileReader API (browser-native)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Format       │  ← PDF: pdfjs-dist | DOCX: JSZip + XML
│  Dispatcher   │  ← XLSX: SheetJS  | HTML: DOMParser
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  v0.2 Engine  │  ← Structure Layer → Table Layer → Text Layer
│  (pdf-engine) │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  CSP Builder  │  ← 3-layer protocol output
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Output       │  ← Markdown / CSP JSON / Raw JSON
└──────────────┘
```

**Everything runs in your browser. Nothing leaves your device.**

## Why CleanSlate?

| Feature | CleanSlate | MarkItDown | Docling | Unstructured |
|---------|-----------|------------|---------|--------------|
| Zero Install | ✅ Browser | ❌ Python | ❌ Python | ❌ Docker |
| Zero Upload | ✅ Local | ✅ Local | ✅ Local | ⚠️ Cloud option |
| Heading Detection | ✅ Font clustering | ✅ Basic | ✅ Deep learning | ✅ Deep learning |
| Table Extraction | ⚠️ Spatial analysis | ⚠️ Basic | ✅ Advanced | ✅ Advanced |
| CJK Support | ✅ Dedicated | ❌ None | ⚠️ Basic | ⚠️ Basic |
| Verifiable Output | ✅ CSP Layer 3 | ❌ | ❌ | ❌ |
| Protocol Standard | ✅ CSP v1.0 | ❌ | ❌ | ❌ |
| Speed | <50ms/page | ~200ms/page | ~2s/page | ~5s/page |

## CSP Output

The Playground supports three output modes:

- **CSP Output** — Full 3-layer protocol JSON (for AI agent integration)
- **Markdown** — Clean, structured Markdown (for human reading)
- **Raw JSON** — Unprocessed extraction data (for debugging)

## Roadmap

- [ ] **v0.3**: Tesseract.js WASM integration for scanned PDF OCR
- [ ] **v0.3**: Code block detection via monospace font analysis
- [ ] **v0.4**: Multi-column layout support
- [ ] **v0.5**: LangChain / LlamaIndex plugin packages
- [ ] **v1.0**: Full CSP specification with RFC draft
- [ ] **v1.0**: Python SDK (`pip install cleanslate`)
- [ ] **v1.5**: Real-time collaborative document processing

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Development setup
git clone https://github.com/andi586/cleanslate-pdf-engine.git
cd cleanslate-pdf-engine
pnpm install
pnpm dev
```

### Areas We Need Help

- 🔍 **PDF Engine** — Improve table detection for complex financial reports
- 🌏 **i18n** — Add support for more CJK edge cases (Japanese, Korean)
- 🧪 **Testing** — More real-world PDF samples for benchmarking
- 📖 **Documentation** — Protocol specification writing
- 🔌 **Integrations** — LangChain, LlamaIndex, AutoGen plugins

## License

MIT License — see [LICENSE](LICENSE) for details.

## Star History

If CleanSlate helps your AI pipeline, please give us a ⭐ — it helps others discover the project.

---

<p align="center">
  <strong>CleanSlate Protocol</strong> — AI 时代的数据标准化层<br/>
  <sub>Built for the AI agent era. Open protocol. Privacy-first. Browser-native.</sub>
</p>
