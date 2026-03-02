/*
 * CleanSlate AI - Landing Page
 * Design: Wabi-Sabi + Swiss Internationalism
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
  Copy,
  Download,
  Eye,
  Lock,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310419663031399163/fUqHMuaqwhHMQAT4LsRcyA/hero-bg-PSaqNxi9uxSYebajqDvNzz.webp";
const FEATURE_TRANSFORM = "https://d2xsxph8kpxj0f.cloudfront.net/310419663031399163/fUqHMuaqwhHMQAT4LsRcyA/feature-transform-PHmhBwhebF983ndYzNmVQ5.webp";
const DRAG_DROP = "https://d2xsxph8kpxj0f.cloudfront.net/310419663031399163/fUqHMuaqwhHMQAT4LsRcyA/drag-drop-illustration-9BUc6p5Cses4qdwGyuU4tF.webp";
const PRIVACY_SHIELD = "https://d2xsxph8kpxj0f.cloudfront.net/310419663031399163/fUqHMuaqwhHMQAT4LsRcyA/privacy-shield-iSNujEsbpgZMgLFVuN6muL.webp";
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

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/30">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-sm bg-primary flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-serif font-semibold text-lg tracking-tight">CleanSlate</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Features</a>
            <a href="#privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Privacy</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">How it works</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-4.5 h-4.5" />
            </a>
            <Link href="/convert">
              <Button size="sm" className="font-sans text-sm">
                Open App
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />

        <div className="container relative z-10 pt-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.div variants={fadeUp} custom={0} className="mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/80 text-accent-foreground text-xs font-medium border border-border/30">
                <Sparkles className="w-3 h-3" />
                100% Local Processing · Zero Cloud Uploads
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-[1.1] tracking-tight text-foreground mb-6"
            >
              From messy docs
              <br />
              <span className="text-primary">to clean Markdown.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg font-sans"
            >
              Transform PDFs, Word documents, spreadsheets, and images into AI-friendly Markdown — entirely in your browser. No uploads. No servers. No compromise.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-3">
              <Link href="/convert">
                <Button size="lg" className="font-sans text-base px-6 h-12">
                  Start Converting
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="font-sans text-base px-6 h-12 bg-background/60 backdrop-blur-sm">
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                </Button>
              </a>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-primary" />
                Privacy-first
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary" />
                Instant conversion
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" />
                10+ formats
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Supported Formats Bar */}
      <section className="border-y border-border/40 bg-secondary/30">
        <div className="container py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {["PDF", "DOCX", "XLSX", "PPTX", "HTML", "CSV", "TXT", "PNG", "JPEG", "JSON"].map((fmt) => (
              <span key={fmt} className="text-xs font-mono font-medium text-muted-foreground tracking-wider uppercase">
                .{fmt.toLowerCase()}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24" style={{ backgroundImage: `url(${PAPER_TEXTURE})`, backgroundSize: '400px', backgroundRepeat: 'repeat' }}>
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-4">
              Three steps. That's it.
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg max-w-md mx-auto">
              No accounts. No API keys. No configuration. Just drag, convert, and copy.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                step: "01",
                title: "Drop your files",
                desc: "Drag any document onto the converter. PDFs, Word files, spreadsheets, images — all welcome.",
                icon: Download,
              },
              {
                step: "02",
                title: "Instant conversion",
                desc: "CleanSlate processes everything locally in your browser. Your files never leave your device.",
                icon: Zap,
              },
              {
                step: "03",
                title: "Copy or download",
                desc: "Get clean Markdown ready for ChatGPT, Claude, Notion, or any AI tool. One click to copy.",
                icon: Copy,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                custom={i}
                className="relative"
              >
                <div className="bg-card/80 backdrop-blur-sm border border-border/40 rounded-lg p-6 h-full hover:shadow-md transition-shadow duration-300">
                  <span className="font-mono text-xs text-primary/60 font-medium">{item.step}</span>
                  <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center mt-3 mb-4">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-5 h-5 text-border" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature: Transform */}
      <section id="features" className="py-24 bg-secondary/20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.span variants={fadeUp} custom={0} className="text-xs font-mono text-primary/70 uppercase tracking-wider">
                Core Feature
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-2 mb-4">
                From chaos to clarity
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed mb-6">
                CleanSlate doesn't just extract text — it understands document structure. Headings become headers. Tables stay tables. Lists remain lists. The output is Markdown that AI models actually love to read.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="space-y-3">
                {[
                  "Smart heading detection and hierarchy preservation",
                  "Table extraction with proper Markdown formatting",
                  "Code block identification and syntax preservation",
                  "Link and image reference extraction",
                ].map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm text-foreground/80">{feature}</span>
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
              <div className="rounded-lg overflow-hidden border border-border/40 shadow-lg">
                <img
                  src={FEATURE_TRANSFORM}
                  alt="Document transformation from messy to clean Markdown"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature: Privacy */}
      <section id="privacy" className="py-24" style={{ backgroundImage: `url(${PAPER_TEXTURE})`, backgroundSize: '400px', backgroundRepeat: 'repeat' }}>
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
                  src={PRIVACY_SHIELD}
                  alt="Privacy shield protecting documents"
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
                Privacy First
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-2 mb-4">
                Your files never leave your device
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed mb-6">
                Unlike cloud-based converters, CleanSlate processes everything locally in your browser using WebAssembly. No file uploads. No server processing. No data retention. Your documents remain yours.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="grid grid-cols-2 gap-4">
                {[
                  { icon: Lock, label: "Zero uploads", desc: "Files stay on your device" },
                  { icon: Shield, label: "No tracking", desc: "No analytics on your files" },
                  { icon: Eye, label: "Open source", desc: "Audit the code yourself" },
                  { icon: Zap, label: "Offline capable", desc: "Works without internet" },
                ].map((item) => (
                  <div key={item.label} className="bg-card/60 border border-border/30 rounded-md p-3">
                    <item.icon className="w-4 h-4 text-primary mb-2" />
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Drag & Drop Showcase */}
      <section className="py-24 bg-secondary/20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.span variants={fadeUp} custom={0} className="text-xs font-mono text-primary/70 uppercase tracking-wider">
                Effortless
              </motion.span>
              <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mt-2 mb-4">
                Drop it. Done.
              </motion.h2>
              <motion.p variants={fadeUp} custom={2} className="text-muted-foreground text-lg leading-relaxed mb-6">
                No menus. No settings. No learning curve. Just drag your files and get perfect Markdown. CleanSlate automatically detects file types, extracts content, and formats everything beautifully.
              </motion.p>
              <motion.div variants={fadeUp} custom={3}>
                <Link href="/convert">
                  <Button size="lg" className="font-sans">
                    Try it now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-lg overflow-hidden border border-border/40 shadow-lg">
                <img
                  src={DRAG_DROP}
                  alt="Drag and drop document conversion"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
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
            className="text-center max-w-xl mx-auto"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-4">
              Ready for a clean slate?
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg mb-8">
              Stop wrestling with document formats. Start feeding your AI tools the clean data they deserve.
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="flex flex-wrap justify-center gap-3">
              <Link href="/convert">
                <Button size="lg" className="font-sans text-base px-8 h-12">
                  Open CleanSlate
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
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-secondary/20">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-sm bg-primary flex items-center justify-center">
                <FileText className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-serif text-sm font-medium">CleanSlate AI</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Open source. Privacy-first. Built for the AI era.
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
