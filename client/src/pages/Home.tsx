/*
 * CleanSlate Protocol (CSP) - Landing Page
 * Design: Wabi-Sabi + Swiss Internationalism
 * Positioning: AI Data Standard Layer — "The HTTP of AI Data"
 * Colors: Warm white (#FAFAF5) + Deep ink (#1A1A2E) + Indigo (#16537E)
 * Fonts: Playfair Display (headings) + Source Sans 3 (body) + Fira Code (code)
 */

import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  FileText,
  Github,
  Layers,
  Lock,
  Sparkles,
  ChevronRight,
  Code2,
  Database,
  CheckCircle2,
  Globe,
  Cpu,
  Hash,
  Network,
  Terminal,
  Box,
} from "lucide-react";

// CDN Assets
const CSP_HERO = "https://d2xsxph8kpxj0f.cloudfront.net/310419663031399163/fUqHMuaqwhHMQAT4LsRcyA/csp-hero-protocol-cGrh7xkqaD3EagA7d4KQgJ.webp";
const CSP_DATA_FLOW = "https://d2xsxph8kpxj0f.cloudfront.net/310419663031399163/fUqHMuaqwhHMQAT4LsRcyA/csp-data-flow-mrQ29hJAoeb2x8BG4YN4Xc.webp";
const CSP_AGENT = "https://d2xsxph8kpxj0f.cloudfront.net/310419663031399163/fUqHMuaqwhHMQAT4LsRcyA/csp-agent-integration-kiv8sYPBaLs7MUsEa2NKNy.webp";
const CSP_VERIFY = "https://d2xsxph8kpxj0f.cloudfront.net/310419663031399163/fUqHMuaqwhHMQAT4LsRcyA/csp-verification-StyYkuwXybxAasjfjzwwgT.webp";
const PAPER_TEXTURE = "https://d2xsxph8kpxj0f.cloudfront.net/310419663031399163/fUqHMuaqwhHMQAT4LsRcyA/paper-texture-KujUNu3zKcfgHbtiuje7Mx.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

// CSP Protocol code example
const CSP_CODE_EXAMPLE = `{
  "csp_version": "1.0",
  "document_id": "a7f3c2e1-...",
  "layers": {
    "raw": {
      "source_type": "pdf",
      "checksum": "sha256:e3b0c44...",
      "page_count": 12
    },
    "semantic": {
      "title": "Q4 Financial Report",
      "sections": [{
        "id": "s1",
        "semantic_role": "financial_summary",
        "confidence": 0.97,
        "entities": [
          { "type": "currency", "value": "$2.4M" },
          { "type": "date", "value": "2026-Q4" }
        ]
      }]
    },
    "verification": {
      "hash_tree": "merkle:7d2f...",
      "signature": "ed25519:...",
      "timestamp": "2026-03-03T00:00:00Z"
    }
  }
}`;

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/30">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center">
              <Layers className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif font-semibold text-lg tracking-tight">CleanSlate</span>
            <span className="text-[10px] font-mono text-primary/70 bg-accent/60 px-1.5 py-0.5 rounded ml-1">CSP v1.0</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#protocol" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Protocol</a>
            <a href="#architecture" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Architecture</a>
            <a href="#integrations" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Integrations</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-4.5 h-4.5" />
            </a>
            <Link href="/convert">
              <Button size="sm" className="font-sans text-sm">
                Try Playground
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${CSP_HERO})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />

        <div className="container relative z-10 pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono border border-primary/20">
                <Sparkles className="w-3 h-3" />
                Open Protocol · RFC Draft · v1.0
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-serif font-bold leading-[1.08] tracking-tight text-foreground mb-6"
            >
              The standardization layer
              <br />
              <span className="text-primary">every AI agent needs.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-4 max-w-2xl font-sans"
            >
              CleanSlate Protocol (CSP) transforms any document into a structured, verifiable, semantically-rich format that AI systems can trust. Not just conversion — <strong className="text-foreground">standardization</strong>.
            </motion.p>

            <motion.p
              variants={fadeUp}
              custom={2.5}
              className="text-base text-muted-foreground/80 leading-relaxed mb-8 max-w-xl font-sans"
            >
              Three layers. One protocol. Every document becomes AI-native.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3">
              <Link href="/convert">
                <Button size="lg" className="font-sans text-base px-6 h-12">
                  Open Playground
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="#protocol">
                <Button variant="outline" size="lg" className="font-sans text-base px-6 h-12 bg-background/60 backdrop-blur-sm">
                  <Code2 className="w-4 h-4 mr-2" />
                  Read the Spec
                </Button>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="font-sans text-base px-6 h-12 bg-background/60 backdrop-blur-sm">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </a>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="mt-10 flex items-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-primary" />
                3-Layer Protocol
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" />
                Verifiable Output
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-primary" />
                Agent-Native
              </span>
              <span className="flex items-center gap-1.5 hidden sm:flex">
                <Lock className="w-4 h-4 text-primary" />
                Privacy-First
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 border-y border-border/40 bg-secondary/20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-4">
              The Problem
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-2xl sm:text-3xl font-serif font-bold tracking-tight mb-6">
              AI agents are only as good as their input data.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-muted-foreground leading-relaxed mb-8">
              Every day, billions of documents are fed to LLMs in formats they were never designed to understand. PDFs lose structure. Word docs lose semantics. Spreadsheets lose context. The result? Hallucinations, missed data, and broken agent workflows.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { stat: "73%", label: "of RAG failures trace back to poor document parsing" },
                { stat: "4.2B", label: "documents processed by AI daily — most lose critical structure" },
                { stat: "0", label: "open standards exist for AI-native document representation" },
              ].map((item) => (
                <div key={item.stat} className="bg-card/80 border border-border/40 rounded-lg p-5">
                  <p className="text-3xl font-serif font-bold text-primary mb-1">{item.stat}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Protocol Overview - 3 Layers */}
      <section id="protocol" className="py-24" style={{ backgroundImage: `url(${PAPER_TEXTURE})`, backgroundSize: '400px', backgroundRepeat: 'repeat' }}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-3">
              CSP Architecture
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-4">
              Three layers. Complete trust.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg max-w-lg mx-auto">
              Every document passes through three protocol layers, each adding structure, meaning, and verifiability.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                layer: "Layer 1",
                title: "Raw Extraction",
                desc: "Preserves the complete original content with source tracking, page mapping, and cryptographic checksums. Nothing is lost.",
                icon: Database,
                color: "bg-amber-50 border-amber-200/60",
                iconColor: "text-amber-700",
                fields: ["raw_text", "source_type", "page_map", "checksum"],
              },
              {
                layer: "Layer 2",
                title: "Semantic Structure",
                desc: "The core innovation. Assigns semantic roles, confidence scores, and entity extraction to every section. AI understands not just text, but meaning.",
                icon: Cpu,
                color: "bg-blue-50/80 border-blue-200/60",
                iconColor: "text-blue-700",
                fields: ["semantic_role", "confidence", "entities", "section_id"],
              },
              {
                layer: "Layer 3",
                title: "Verification",
                desc: "Merkle hash trees, digital signatures, and timestamps make every output auditable and tamper-proof. Enterprise-grade trust.",
                icon: Shield,
                color: "bg-slate-50 border-slate-200/60",
                iconColor: "text-slate-700",
                fields: ["hash_tree", "block_hashes", "signature", "timestamp"],
              },
            ].map((item, i) => (
              <motion.div
                key={item.layer}
                variants={fadeUp}
                custom={i}
                className="relative"
              >
                <div className={`${item.color} border rounded-lg p-6 h-full hover:shadow-lg transition-all duration-300`}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-mono text-[10px] text-muted-foreground/70 uppercase tracking-wider">{item.layer}</span>
                  </div>
                  <div className={`w-10 h-10 rounded-md bg-white/80 flex items-center justify-center mb-4 border border-border/20`}>
                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {item.fields.map((field) => (
                      <span key={field} className="text-[10px] font-mono bg-white/60 border border-border/30 px-2 py-0.5 rounded text-muted-foreground">
                        {field}
                      </span>
                    ))}
                  </div>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-border" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Code Example */}
      <section id="architecture" className="py-24 bg-secondary/20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.span variants={fadeUp} custom={0} className="text-xs font-mono text-primary/70 uppercase tracking-wider">
                Protocol Spec
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-2 mb-4">
                One document. Three layers. Complete context.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed mb-6">
                CSP wraps every document in a three-layer envelope. The raw layer preserves fidelity. The semantic layer adds machine understanding. The verification layer adds trust. Together, they form a single, portable, AI-native document.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="space-y-3">
                {[
                  { icon: Hash, text: "SHA-256 checksums for every block — tamper detection built in" },
                  { icon: Cpu, text: "Semantic roles with confidence scores — AI knows what it's reading" },
                  { icon: Network, text: "Merkle hash trees — verify any section without the full document" },
                  { icon: Globe, text: "JSON-based, language-agnostic — works with any LLM framework" },
                ].map((feature) => (
                  <div key={feature.text} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                      <feature.icon className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/80">{feature.text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="rounded-lg overflow-hidden border border-border/60 shadow-xl bg-[#1a1a2e]">
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#12121f] border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
                  <span className="ml-3 text-[10px] font-mono text-white/30">output.csp.json</span>
                </div>
                <pre className="p-5 text-[11px] sm:text-xs font-mono text-blue-200/80 overflow-x-auto leading-relaxed max-h-[420px]">
                  <code>{CSP_CODE_EXAMPLE}</code>
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Data Flow Visualization */}
      <section className="py-24" style={{ backgroundImage: `url(${PAPER_TEXTURE})`, backgroundSize: '400px', backgroundRepeat: 'repeat' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <div className="rounded-lg overflow-hidden border border-border/40 shadow-lg bg-card/50">
                <img
                  src={CSP_DATA_FLOW}
                  alt="CSP data transformation pipeline"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="order-1 lg:order-2"
            >
              <motion.span variants={fadeUp} custom={0} className="text-xs font-mono text-primary/70 uppercase tracking-wider">
                Pipeline
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-2 mb-4">
                From chaos to verifiable structure
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed mb-6">
                CSP doesn't just convert — it standardizes. Every document enters as an opaque binary blob and exits as a structured, semantically-tagged, cryptographically-verified AI-native object.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="space-y-4">
                {[
                  { step: "01", title: "Ingest", desc: "Accept any format: PDF, DOCX, XLSX, HTML, images, and more. Raw bytes preserved with checksums." },
                  { step: "02", title: "Parse & Structure", desc: "Extract text, detect headings, tables, code blocks. Build a semantic tree with confidence scores." },
                  { step: "03", title: "Verify & Sign", desc: "Generate Merkle hash tree, sign the output, timestamp it. Every section independently verifiable." },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <span className="font-mono text-xs text-primary/50 font-medium mt-1 shrink-0">{item.step}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-24 bg-secondary/20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.span variants={fadeUp} custom={0} className="text-xs font-mono text-primary/70 uppercase tracking-wider">
                Ecosystem
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-2 mb-4">
                Plug into every AI framework
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed mb-6">
                CSP is designed as a universal protocol layer. Native plugins for LangChain, LlamaIndex, and AutoGen. REST API for custom integrations. Browser SDK for client-side processing.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="grid grid-cols-2 gap-3">
                {[
                  { name: "LangChain", desc: "Document loader plugin", icon: Code2 },
                  { name: "LlamaIndex", desc: "Reader integration", icon: Database },
                  { name: "AutoGen", desc: "Agent tool adapter", icon: Cpu },
                  { name: "REST API", desc: "Universal endpoint", icon: Terminal },
                  { name: "Browser SDK", desc: "Client-side processing", icon: Globe },
                  { name: "Python SDK", desc: "pip install cleanslate", icon: Box },
                ].map((item) => (
                  <div key={item.name} className="bg-card/60 border border-border/30 rounded-md p-3 hover:shadow-sm transition-shadow">
                    <item.icon className="w-4 h-4 text-primary mb-2" />
                    <p className="text-sm font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-lg overflow-hidden border border-border/40 shadow-lg">
                <img
                  src={CSP_AGENT}
                  alt="AI agent integration hub"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Verification & Trust */}
      <section className="py-24" style={{ backgroundImage: `url(${PAPER_TEXTURE})`, backgroundSize: '400px', backgroundRepeat: 'repeat' }}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-lg overflow-hidden border border-border/40 shadow-lg">
                <img
                  src={CSP_VERIFY}
                  alt="Data verification and trust"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.span variants={fadeUp} custom={0} className="text-xs font-mono text-primary/70 uppercase tracking-wider">
                Trust Layer
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-2 mb-4">
                Verifiable by design
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed mb-6">
                In a world of AI hallucinations, provenance matters. CSP's verification layer ensures every piece of extracted data can be traced back to its source, verified for integrity, and audited for compliance.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="space-y-3">
                {[
                  "Merkle hash trees — verify any section without the full document",
                  "Ed25519 digital signatures — tamper-proof output certification",
                  "ISO 8601 timestamps — immutable processing audit trail",
                  "Block-level hashes — detect modifications at paragraph granularity",
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-foreground/80">{feature}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-24 bg-secondary/20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-3">
              Quick Start
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-4">
              Up and running in 30 seconds
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="max-w-3xl mx-auto space-y-4"
          >
            {[
              { step: "Install", code: "pip install cleanslate-csp", desc: "Python SDK with zero dependencies" },
              { step: "Convert", code: `from cleanslate import CSP\nresult = CSP.parse("report.pdf")`, desc: "One line to structured output" },
              { step: "Verify", code: `assert result.verify()  # True\nprint(result.semantic.sections[0].role)`, desc: "Built-in verification" },
            ].map((item, i) => (
              <motion.div key={item.step} variants={fadeUp} custom={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <span className="text-xs font-mono font-semibold text-primary">{i + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-foreground">{item.step}</h3>
                    <span className="text-xs text-muted-foreground">{item.desc}</span>
                  </div>
                  <div className="bg-[#1a1a2e] rounded-md px-4 py-3 overflow-x-auto">
                    <pre className="text-xs font-mono text-blue-200/80 whitespace-pre">{item.code}</pre>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24" style={{ backgroundImage: `url(${PAPER_TEXTURE})`, backgroundSize: '400px', backgroundRepeat: 'repeat' }}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-3">
              Why CSP
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-4">
              Beyond simple conversion
            </motion.h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-card/80 border border-border/40 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-secondary/30">
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Feature</th>
                    <th className="text-center px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">MarkItDown</th>
                    <th className="text-center px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Docling</th>
                    <th className="text-center px-5 py-3 font-medium text-primary text-xs uppercase tracking-wider font-semibold">CSP</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Semantic roles", a: false, b: false, c: true },
                    { feature: "Confidence scores", a: false, b: true, c: true },
                    { feature: "Entity extraction", a: false, b: false, c: true },
                    { feature: "Verification layer", a: false, b: false, c: true },
                    { feature: "Hash tree audit", a: false, b: false, c: true },
                    { feature: "Browser-native", a: false, b: false, c: true },
                    { feature: "LangChain plugin", a: false, b: true, c: true },
                    { feature: "Open protocol spec", a: false, b: false, c: true },
                  ].map((row) => (
                    <tr key={row.feature} className="border-b border-border/20 last:border-0">
                      <td className="px-5 py-3 text-foreground/80">{row.feature}</td>
                      <td className="px-5 py-3 text-center">
                        {row.a ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {row.b ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-center bg-primary/[0.03]">
                        {row.c ? (
                          <CheckCircle2 className="w-4 h-4 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground/40">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-secondary/20">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-3">
              Use Cases
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-4">
              Built for the AI infrastructure stack
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto"
          >
            {[
              {
                title: "RAG Pipelines",
                desc: "Feed CSP-structured documents into retrieval-augmented generation systems. Semantic sections improve chunk quality by 3x.",
                icon: Database,
              },
              {
                title: "Agent Workflows",
                desc: "Give AI agents structured, verifiable document access. CSP's section IDs enable precise citation and fact-checking.",
                icon: Cpu,
              },
              {
                title: "Compliance & Audit",
                desc: "Financial, legal, and healthcare documents with built-in verification. Every extraction is tamper-proof and auditable.",
                icon: Shield,
              },
              {
                title: "Knowledge Bases",
                desc: "Build enterprise knowledge graphs from CSP output. Semantic roles and entities map directly to graph nodes.",
                icon: Network,
              },
              {
                title: "Multi-Modal AI",
                desc: "CSP preserves image references, table structures, and layout context that plain text extractors lose.",
                icon: Layers,
              },
              {
                title: "Data Pipelines",
                desc: "ETL workflows with built-in data quality. Confidence scores flag low-quality extractions before they enter your pipeline.",
                icon: Zap,
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i}
                className="bg-card/80 border border-border/40 rounded-lg p-5 hover:shadow-md transition-all duration-300"
              >
                <item.icon className="w-5 h-5 text-primary mb-3" />
                <h3 className="font-serif text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/[0.03]" />
        <div className="container relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center max-w-2xl mx-auto"
          >
            <motion.p variants={fadeUp} custom={0} className="text-xs font-mono text-primary/70 uppercase tracking-widest mb-4">
              Join the Standard
            </motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-4">
              The AI data layer starts here.
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg mb-8">
              CleanSlate Protocol is open source, community-driven, and designed to become the universal standard for AI-native document representation. Try the playground, read the spec, or contribute to the protocol.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap justify-center gap-3">
              <Link href="/convert">
                <Button size="lg" className="font-sans text-base px-8 h-12">
                  Open Playground
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="font-sans text-base px-8 h-12 bg-transparent">
                  <Github className="w-4 h-4 mr-2" />
                  Star on GitHub
                </Button>
              </a>
            </motion.div>
            <motion.p variants={fadeUp} custom={4} className="mt-6 text-xs text-muted-foreground/60 font-mono">
              pip install cleanslate-csp · npm install @cleanslate/csp · brew install cleanslate
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-secondary/20">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-sm bg-primary flex items-center justify-center">
                <Layers className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-serif text-sm font-medium">CleanSlate Protocol</span>
              <span className="text-[9px] font-mono text-muted-foreground/60">CSP v1.0</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Open protocol. Privacy-first. The AI data standard layer.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
