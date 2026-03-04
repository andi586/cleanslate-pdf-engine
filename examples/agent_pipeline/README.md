# Agent Pipeline Example

This example demonstrates how to use CleanSlate Protocol (CSP) as the standardized input layer for an AI Agent pipeline.

## Pipeline Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Document Source │────▶│  CleanSlate       │────▶│  AI Agent       │
│  (PDF, DOCX...) │     │  Parser           │     │  (LLM Pipeline) │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │                         │
                              ▼                         ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │  CSP Schema      │     │  Structured     │
                        │  (Verified JSON) │     │  Response       │
                        └──────────────────┘     └─────────────────┘
```

## Flow

1. **Ingest** — A source document (PDF, DOCX, etc.) enters the pipeline
2. **Parse** — CleanSlate Parser extracts content with structural analysis
3. **Standardize** — Output is formatted as CSP Schema JSON with semantic roles, entities, and verification hashes
4. **Consume** — An AI Agent reads the CSP JSON as its structured input, with full confidence in data integrity

## Files

| File | Description |
|------|-------------|
| `input_sample.pdf` | (Placeholder) Any PDF document as pipeline input |
| `csp_output.json` | Example CSP Schema output after parsing |
| `agent_prompt.md` | Example system prompt for an AI Agent consuming CSP data |
| `agent_response.json` | Example structured response from the AI Agent |

## Usage

```bash
# Step 1: Parse document to CSP format (using CleanSlate Playground or SDK)
# Upload any PDF to https://cleanslate.app/convert → select "CSP Output" mode

# Step 2: Feed CSP output to your AI Agent
cat csp_output.json | your_agent_pipeline

# Step 3: Agent produces structured response
# See agent_response.json for example output
```

## Why CSP for AI Agents?

Traditional document-to-LLM pipelines suffer from three critical problems:

1. **Data loss** — Raw text extraction loses structure, tables, and hierarchy
2. **No verification** — Agents cannot verify if the input data is complete or tampered
3. **No semantics** — LLMs must guess what each text block represents

CSP solves all three by providing a standardized, verified, semantically-annotated document format that any AI Agent can consume with confidence.
