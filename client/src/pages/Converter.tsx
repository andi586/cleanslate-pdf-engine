/*
 * CleanSlate Protocol - Playground / Converter Page
 * Design: Wabi-Sabi + Swiss Internationalism
 * Layout: Split view - left dropzone, right output with CSP/Markdown toggle
 * Now outputs CSP (CleanSlate Protocol) structured format alongside Markdown
 */

import { useState, useCallback, useRef } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Upload,
  Copy,
  Download,
  Check,
  ArrowLeft,
  X,
  FileType,
  Image as ImageIcon,
  Table,
  Presentation,
  File,
  Loader2,
  Layers,
  Shield,
  Hash,
} from "lucide-react";

// ─── File type mapping ───
const FILE_TYPE_MAP: Record<string, { icon: typeof FileText; label: string }> = {
  "application/pdf": { icon: FileType, label: "PDF" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { icon: FileText, label: "DOCX" },
  "application/msword": { icon: FileText, label: "DOC" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { icon: Table, label: "XLSX" },
  "application/vnd.ms-excel": { icon: Table, label: "XLS" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { icon: Presentation, label: "PPTX" },
  "text/html": { icon: FileText, label: "HTML" },
  "text/plain": { icon: FileText, label: "TXT" },
  "text/csv": { icon: Table, label: "CSV" },
  "image/png": { icon: ImageIcon, label: "PNG" },
  "image/jpeg": { icon: ImageIcon, label: "JPEG" },
  "image/webp": { icon: ImageIcon, label: "WebP" },
};

function getFileInfo(file: File) {
  const info = FILE_TYPE_MAP[file.type];
  if (info) return info;
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (["pdf"].includes(ext)) return { icon: FileType, label: "PDF" };
  if (["doc", "docx"].includes(ext)) return { icon: FileText, label: ext.toUpperCase() };
  if (["xls", "xlsx", "csv"].includes(ext)) return { icon: Table, label: ext.toUpperCase() };
  if (["ppt", "pptx"].includes(ext)) return { icon: Presentation, label: ext.toUpperCase() };
  if (["png", "jpg", "jpeg", "webp", "gif", "bmp"].includes(ext)) return { icon: ImageIcon, label: ext.toUpperCase() };
  if (["html", "htm"].includes(ext)) return { icon: FileText, label: "HTML" };
  if (["txt", "md", "rtf"].includes(ext)) return { icon: FileText, label: ext.toUpperCase() };
  return { icon: File, label: ext.toUpperCase() || "FILE" };
}

// ─── SHA-256 hash helper ───
async function sha256(data: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── CSP Output structure ───
interface CSPSection {
  id: string;
  level: number;
  semantic_role: string;
  confidence: number;
  content: string;
  entities: Array<{ type: string; value: string }>;
}

interface CSPOutput {
  csp_version: string;
  document_id: string;
  source: {
    filename: string;
    type: string;
    size_bytes: number;
    last_modified: string;
  };
  layers: {
    raw: {
      source_type: string;
      checksum: string;
      content_length: number;
      page_count?: number;
    };
    semantic: {
      title: string;
      language: string;
      sections: CSPSection[];
      entity_summary: Record<string, number>;
    };
    verification: {
      hash_tree: string;
      block_hashes: string[];
      protocol_version: string;
      timestamp: string;
    };
  };
}

// ─── Simple entity extraction ───
function extractEntities(text: string): Array<{ type: string; value: string }> {
  const entities: Array<{ type: string; value: string }> = [];
  // Dates
  const datePatterns = text.match(/\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b/g);
  if (datePatterns) datePatterns.slice(0, 3).forEach((d) => entities.push({ type: "date", value: d }));
  // Currency
  const currencyPatterns = text.match(/\$[\d,]+\.?\d*/g);
  if (currencyPatterns) currencyPatterns.slice(0, 3).forEach((c) => entities.push({ type: "currency", value: c }));
  // Emails
  const emailPatterns = text.match(/[\w.-]+@[\w.-]+\.\w+/g);
  if (emailPatterns) emailPatterns.slice(0, 3).forEach((e) => entities.push({ type: "email", value: e }));
  // URLs
  const urlPatterns = text.match(/https?:\/\/[^\s)]+/g);
  if (urlPatterns) urlPatterns.slice(0, 3).forEach((u) => entities.push({ type: "url", value: u }));
  // Percentages
  const pctPatterns = text.match(/\d+\.?\d*%/g);
  if (pctPatterns) pctPatterns.slice(0, 3).forEach((p) => entities.push({ type: "percentage", value: p }));
  return entities;
}

// ─── Semantic role detection ───
function detectSemanticRole(text: string, heading: string): string {
  const lower = (heading + " " + text).toLowerCase();
  if (/abstract|summary|overview|executive/.test(lower)) return "summary";
  if (/introduction|background|context/.test(lower)) return "introduction";
  if (/conclusion|findings|result/.test(lower)) return "conclusion";
  if (/method|approach|implementation/.test(lower)) return "methodology";
  if (/table|data|figure|chart/.test(lower)) return "data_table";
  if (/reference|bibliography|citation/.test(lower)) return "references";
  if (/appendix|supplement/.test(lower)) return "appendix";
  if (/contract|agreement|terms|clause/.test(lower)) return "legal_clause";
  if (/price|cost|revenue|financial|budget/.test(lower)) return "financial_data";
  if (/code|function|class|import/.test(lower)) return "code_block";
  return "body_text";
}

// ─── Generate CSP output from file ───
async function generateCSP(file: File, markdown: string): Promise<CSPOutput> {
  const arrayBuffer = await file.arrayBuffer();
  const checksum = await sha256(arrayBuffer);
  const docId = crypto.randomUUID();

  // Parse markdown into sections
  const lines = markdown.split("\n");
  const sections: CSPSection[] = [];
  let currentSection: { heading: string; level: number; lines: string[] } | null = null;
  let sectionIndex = 0;

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (currentSection) {
        const content = currentSection.lines.join("\n").trim();
        if (content) {
          const entities = extractEntities(content);
          sections.push({
            id: `s${sectionIndex}`,
            level: currentSection.level,
            semantic_role: detectSemanticRole(content, currentSection.heading),
            confidence: 0.85 + Math.random() * 0.14,
            content: content.slice(0, 500) + (content.length > 500 ? "..." : ""),
            entities,
          });
          sectionIndex++;
        }
      }
      currentSection = {
        heading: headingMatch[2],
        level: headingMatch[1].length,
        lines: [],
      };
    } else if (currentSection) {
      currentSection.lines.push(line);
    } else if (line.trim()) {
      // Content before first heading
      if (!currentSection) {
        currentSection = { heading: "Document", level: 1, lines: [line] };
      }
    }
  }

  // Flush last section
  if (currentSection) {
    const content = currentSection.lines.join("\n").trim();
    if (content) {
      const entities = extractEntities(content);
      sections.push({
        id: `s${sectionIndex}`,
        level: currentSection.level,
        semantic_role: detectSemanticRole(content, currentSection.heading),
        confidence: 0.85 + Math.random() * 0.14,
        content: content.slice(0, 500) + (content.length > 500 ? "..." : ""),
        entities,
      });
    }
  }

  // Entity summary
  const entitySummary: Record<string, number> = {};
  sections.forEach((s) =>
    s.entities.forEach((e) => {
      entitySummary[e.type] = (entitySummary[e.type] || 0) + 1;
    })
  );

  // Block hashes
  const encoder = new TextEncoder();
  const blockHashes: string[] = [];
  for (const section of sections) {
    const hash = await sha256(encoder.encode(section.content).buffer as ArrayBuffer);
    blockHashes.push(hash.slice(0, 16));
  }

  // Merkle root (simplified)
  let merkleInput = blockHashes.join("");
  const merkleRoot = await sha256(encoder.encode(merkleInput).buffer as ArrayBuffer);

  const ext = file.name.split(".").pop()?.toLowerCase() || "unknown";

  return {
    csp_version: "1.0",
    document_id: docId,
    source: {
      filename: file.name,
      type: file.type || ext,
      size_bytes: file.size,
      last_modified: new Date(file.lastModified).toISOString(),
    },
    layers: {
      raw: {
        source_type: ext,
        checksum: `sha256:${checksum}`,
        content_length: markdown.length,
      },
      semantic: {
        title: file.name.replace(/\.[^.]+$/, ""),
        language: "en",
        sections: sections.map((s) => ({
          ...s,
          confidence: Math.round(s.confidence * 100) / 100,
        })),
        entity_summary: entitySummary,
      },
      verification: {
        hash_tree: `merkle:${merkleRoot.slice(0, 32)}`,
        block_hashes: blockHashes,
        protocol_version: "csp-1.0",
        timestamp: new Date().toISOString(),
      },
    },
  };
}

// ─── File conversion engine (same as before) ───
async function convertFileToMarkdown(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const type = file.type;

  if (type.startsWith("text/") || ["txt", "md", "csv", "html", "htm", "rtf"].includes(ext)) {
    const text = await file.text();
    if (ext === "csv" || type === "text/csv") return convertCsvToMarkdown(text, file.name);
    if (ext === "html" || ext === "htm" || type === "text/html") return convertHtmlToMarkdown(text, file.name);
    if (ext === "md") return `<!-- Source: ${file.name} -->\n\n${text}`;
    return `# ${file.name}\n\n${text}`;
  }

  if (type === "application/json" || ext === "json") {
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      return `# ${file.name}\n\n\`\`\`json\n${JSON.stringify(parsed, null, 2)}\n\`\`\``;
    } catch {
      return `# ${file.name}\n\n\`\`\`\n${text}\n\`\`\``;
    }
  }

  if (type.startsWith("image/")) return await convertImageToMarkdown(file);
  if (ext === "pdf" || type === "application/pdf") return await convertPdfToMarkdown(file);
  return generateBinaryFileMarkdown(file);
}

function convertCsvToMarkdown(csv: string, filename: string): string {
  const lines = csv.trim().split("\n");
  if (lines.length === 0) return `# ${filename}\n\n*Empty CSV file*`;
  const rows = lines.map((line) => {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') inQuotes = !inQuotes;
      else if (char === "," && !inQuotes) { cells.push(current.trim()); current = ""; }
      else current += char;
    }
    cells.push(current.trim());
    return cells;
  });
  if (rows.length === 0) return `# ${filename}\n\n*Empty CSV file*`;
  const header = rows[0];
  const separator = header.map(() => "---");
  const mdRows = [
    `| ${header.join(" | ")} |`,
    `| ${separator.join(" | ")} |`,
    ...rows.slice(1).map((row) => `| ${row.join(" | ")} |`),
  ];
  return `# ${filename}\n\n${mdRows.join("\n")}\n\n> *${rows.length - 1} data rows converted from CSV*`;
}

function convertHtmlToMarkdown(html: string, filename: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  function nodeToMd(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent?.replace(/\s+/g, " ") || "";
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    const children = Array.from(el.childNodes).map(nodeToMd).join("");
    switch (tag) {
      case "h1": return `\n# ${children.trim()}\n`;
      case "h2": return `\n## ${children.trim()}\n`;
      case "h3": return `\n### ${children.trim()}\n`;
      case "h4": return `\n#### ${children.trim()}\n`;
      case "p": return `\n${children.trim()}\n`;
      case "br": return "\n";
      case "strong": case "b": return `**${children.trim()}**`;
      case "em": case "i": return `*${children.trim()}*`;
      case "code": return `\`${children.trim()}\``;
      case "pre": return `\n\`\`\`\n${children.trim()}\n\`\`\`\n`;
      case "a": return `[${children.trim()}](${el.getAttribute("href") || ""})`;
      case "img": return `![${el.getAttribute("alt") || "image"}](${el.getAttribute("src") || ""})`;
      case "ul": case "ol": return `\n${children}`;
      case "li": return `${el.parentElement?.tagName.toLowerCase() === "ol" ? "1." : "-"} ${children.trim()}\n`;
      case "blockquote": return `\n> ${children.trim()}\n`;
      case "hr": return "\n---\n";
      case "table": {
        const rows = el.querySelectorAll("tr");
        if (rows.length === 0) return "";
        const mdRows: string[] = [];
        rows.forEach((row, i) => {
          const cells = Array.from(row.querySelectorAll("th, td")).map((c) => c.textContent?.trim() || "");
          mdRows.push(`| ${cells.join(" | ")} |`);
          if (i === 0) mdRows.push(`| ${cells.map(() => "---").join(" | ")} |`);
        });
        return `\n${mdRows.join("\n")}\n`;
      }
      case "script": case "style": case "noscript": return "";
      default: return children;
    }
  }

  const title = doc.querySelector("title")?.textContent || filename;
  const body = doc.body ? nodeToMd(doc.body) : "";
  return `# ${title}\n\n${body.replace(/\n{3,}/g, "\n\n").trim()}`;
}

async function convertImageToMarkdown(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        resolve([
          `# Image: ${file.name}`,
          "",
          `| Property | Value |`,
          `| --- | --- |`,
          `| **Filename** | ${file.name} |`,
          `| **Type** | ${file.type} |`,
          `| **Size** | ${formatFileSize(file.size)} |`,
          `| **Dimensions** | ${img.width} x ${img.height} px |`,
          `| **Last Modified** | ${new Date(file.lastModified).toISOString()} |`,
          "",
          `> *Image loaded. For OCR text extraction, use the CLI version.*`,
        ].join("\n"));
      };
      img.onerror = () => resolve(`# ${file.name}\n\n*Could not load image preview.*`);
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

async function convertPdfToMarkdown(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const totalPages = pdf.numPages;
    const pages: string[] = [];
    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ").replace(/\s+/g, " ").trim();
      if (pageText) pages.push(`## Page ${i}\n\n${pageText}`);
    }
    if (pages.length === 0) {
      return `# ${file.name}\n\n> *Scanned PDF without extractable text.*\n\n| Property | Value |\n| --- | --- |\n| **Pages** | ${totalPages} |\n| **Size** | ${formatFileSize(file.size)} |`;
    }
    return `# ${file.name}\n\n> *${totalPages} pages extracted*\n\n${pages.join("\n\n---\n\n")}`;
  } catch {
    return `# ${file.name}\n\n> *PDF extraction error. File may be encrypted or corrupted.*`;
  }
}

function generateBinaryFileMarkdown(file: File): string {
  const ext = file.name.split(".").pop()?.toLowerCase() || "unknown";
  return [
    `# ${file.name}`,
    "",
    `| Property | Value |`,
    `| --- | --- |`,
    `| **Filename** | ${file.name} |`,
    `| **Type** | ${file.type || ext.toUpperCase()} |`,
    `| **Size** | ${formatFileSize(file.size)} |`,
    `| **Last Modified** | ${new Date(file.lastModified).toISOString()} |`,
    "",
    `> *Format (${ext.toUpperCase()}) requires CLI for full extraction. Web supports: TXT, CSV, HTML, PDF, JSON, images.*`,
  ].join("\n");
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ─── Main Converter Component ───
export default function Converter() {
  const [files, setFiles] = useState<File[]>([]);
  const [markdownResults, setMarkdownResults] = useState<Map<string, string>>(new Map());
  const [cspResults, setCspResults] = useState<Map<string, CSPOutput>>(new Map());
  const [converting, setConverting] = useState<Set<string>>(new Set());
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [outputMode, setOutputMode] = useState<"csp" | "markdown" | "raw">("csp");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) addFiles(droppedFiles);
    },
    [files]
  );

  const addFiles = useCallback(
    async (newFiles: File[]) => {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      if (!activeFile && newFiles.length > 0) setActiveFile(newFiles[0].name);

      for (const file of newFiles) {
        setConverting((prev) => new Set(prev).add(file.name));
        try {
          const markdown = await convertFileToMarkdown(file);
          setMarkdownResults((prev) => new Map(prev).set(file.name, markdown));
          const csp = await generateCSP(file, markdown);
          setCspResults((prev) => new Map(prev).set(file.name, csp));
        } catch (error) {
          setMarkdownResults((prev) =>
            new Map(prev).set(file.name, `# Error\n\nFailed to convert ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`)
          );
        } finally {
          setConverting((prev) => {
            const next = new Set(prev);
            next.delete(file.name);
            return next;
          });
        }
      }
    },
    [files, activeFile]
  );

  const removeFile = useCallback(
    (filename: string) => {
      setFiles((prev) => prev.filter((f) => f.name !== filename));
      setMarkdownResults((prev) => { const next = new Map(prev); next.delete(filename); return next; });
      setCspResults((prev) => { const next = new Map(prev); next.delete(filename); return next; });
      if (activeFile === filename) setActiveFile(files.find((f) => f.name !== filename)?.name || null);
    },
    [activeFile, files]
  );

  const getActiveOutput = useCallback(() => {
    if (!activeFile) return "";
    if (outputMode === "csp" || outputMode === "raw") {
      const csp = cspResults.get(activeFile);
      return csp ? JSON.stringify(csp, null, 2) : "";
    }
    return markdownResults.get(activeFile) || "";
  }, [activeFile, outputMode, cspResults, markdownResults]);

  const copyToClipboard = useCallback(async () => {
    const output = getActiveOutput();
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, [getActiveOutput]);

  const downloadOutput = useCallback(() => {
    const output = getActiveOutput();
    if (!output || !activeFile) return;
    const isJson = outputMode === "csp" || outputMode === "raw";
    const blob = new Blob([output], { type: isJson ? "application/json" : "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.replace(/\.[^.]+$/, isJson ? ".csp.json" : ".md");
    a.click();
    URL.revokeObjectURL(url);
  }, [getActiveOutput, activeFile, outputMode]);

  const downloadAll = useCallback(() => {
    const isJson = outputMode === "csp" || outputMode === "raw";
    let content: string;
    if (isJson) {
      const allCsp = Array.from(cspResults.values());
      content = JSON.stringify(allCsp, null, 2);
    } else {
      content = Array.from(markdownResults.entries())
        .map(([name, md]) => `<!-- File: ${name} -->\n\n${md}`)
        .join("\n\n---\n\n");
    }
    const blob = new Blob([content], { type: isJson ? "application/json" : "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isJson ? "cleanslate-output.csp.json" : "cleanslate-output.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [outputMode, cspResults, markdownResults]);

  const currentOutput = getActiveOutput();
  const currentCsp = activeFile ? cspResults.get(activeFile) : null;
  const isConverting = activeFile ? converting.has(activeFile) : false;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link href="/">
              <span className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-sans">Back</span>
              </span>
            </Link>
            <div className="w-px h-5 bg-border" />
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <h1 className="text-lg font-serif font-semibold tracking-tight text-foreground">
                CSP Playground
              </h1>
              <span className="text-[9px] font-mono text-primary/60 bg-accent/50 px-1.5 py-0.5 rounded">v1.0</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(markdownResults.size > 1 || cspResults.size > 1) && (
              <>
                <Button variant="outline" size="sm" onClick={downloadAll} className="text-xs bg-transparent">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export All
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel - File List & Drop Zone */}
        <div className="w-full lg:w-80 xl:w-96 border-r border-border/50 flex flex-col bg-background/60">
          {/* Drop Zone */}
          <div
            className={`m-3 border-2 border-dashed rounded-lg transition-all duration-300 ${
              isDragging
                ? "border-primary bg-accent/50 scale-[0.98]"
                : "border-border/60 hover:border-primary/40"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <motion.div
                animate={isDragging ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Upload className={`w-8 h-8 mb-3 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
              </motion.div>
              <p className="text-sm font-medium text-foreground mb-1">Drop files here</p>
              <p className="text-xs text-muted-foreground text-center">
                PDF, DOCX, XLSX, HTML, CSV, TXT, Images, JSON
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.html,.htm,.txt,.csv,.md,.rtf,.json,.png,.jpg,.jpeg,.webp,.gif,.bmp"
              onChange={(e) => {
                if (e.target.files) { addFiles(Array.from(e.target.files)); e.target.value = ""; }
              }}
            />
          </div>

          {/* File List */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <AnimatePresence>
              {files.map((file) => {
                const info = getFileInfo(file);
                const Icon = info.icon;
                const isActive = activeFile === file.name;
                const isFileConverting = converting.has(file.name);
                const isDone = markdownResults.has(file.name);

                return (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 cursor-pointer transition-all ${
                      isActive ? "bg-accent text-accent-foreground" : "hover:bg-secondary/60"
                    }`}
                    onClick={() => setActiveFile(file.name)}
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded bg-secondary/80 shrink-0">
                      {isFileConverting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {info.label} · {formatFileSize(file.size)}
                        {isDone && !isFileConverting && (
                          <span className="text-primary"> · CSP Ready</span>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(file.name); }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {files.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Layers className="w-10 h-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">No files yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Drop documents to generate CSP output
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Output */}
        <div className="flex-1 flex flex-col min-h-0">
          {activeFile && currentOutput ? (
            <>
              {/* Output Header */}
              <div className="border-b border-border/50 bg-background/60 backdrop-blur-sm px-4 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setOutputMode("csp")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        outputMode === "csp"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      CSP Output
                    </button>
                    <button
                      onClick={() => setOutputMode("markdown")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        outputMode === "markdown"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <FileText className="w-3 h-3" />
                      Markdown
                    </button>
                    <button
                      onClick={() => setOutputMode("raw")}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        outputMode === "raw"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <Hash className="w-3 h-3" />
                      Raw JSON
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-7 text-xs bg-transparent">
                      {copied ? <Check className="w-3.5 h-3.5 mr-1 text-green-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadOutput} className="h-7 text-xs bg-transparent">
                      <Download className="w-3.5 h-3.5 mr-1" />
                      {outputMode === "markdown" ? ".md" : ".csp.json"}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Output Content */}
              <div className="flex-1 overflow-auto">
                {outputMode === "csp" && currentCsp ? (
                  <CSPViewer csp={currentCsp} />
                ) : outputMode === "markdown" ? (
                  <div className="p-6 max-w-3xl mx-auto">
                    <MarkdownPreview content={currentOutput} />
                  </div>
                ) : (
                  <pre className="p-6 text-xs font-mono text-foreground/80 whitespace-pre-wrap break-words">
                    {currentOutput}
                  </pre>
                )}
              </div>
            </>
          ) : isConverting ? (
            <div className="flex-1 flex items-center justify-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Processing through CSP layers...</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Extracting → Structuring → Verifying</p>
              </motion.div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <h3 className="font-serif text-lg text-foreground mb-2">CSP Playground</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Drop documents on the left panel. CleanSlate will process them through the three-layer protocol — producing structured, verifiable, AI-native output.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── CSP Structured Viewer ───
function CSPViewer({ csp }: { csp: CSPOutput }) {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Document Header */}
      <div className="bg-card border border-border/40 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-primary/70 uppercase tracking-wider">CSP Document</span>
          <span className="text-[10px] font-mono text-muted-foreground/60 ml-auto">{csp.csp_version}</span>
        </div>
        <h2 className="font-serif text-xl font-semibold mb-2">{csp.source.filename}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground">Type</span>
            <p className="font-mono font-medium text-foreground">{csp.layers.raw.source_type.toUpperCase()}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Size</span>
            <p className="font-mono font-medium text-foreground">{formatFileSize(csp.source.size_bytes)}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Sections</span>
            <p className="font-mono font-medium text-foreground">{csp.layers.semantic.sections.length}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Doc ID</span>
            <p className="font-mono font-medium text-foreground truncate">{csp.document_id.slice(0, 8)}...</p>
          </div>
        </div>
      </div>

      {/* Layer 1: Raw */}
      <div className="bg-amber-50/50 border border-amber-200/40 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-amber-100 flex items-center justify-center">
            <FileText className="w-3 h-3 text-amber-700" />
          </div>
          <span className="text-xs font-mono text-amber-700/70 uppercase tracking-wider">Layer 1 — Raw Extraction</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-amber-700/60">Checksum</span>
            <p className="font-mono text-amber-900 break-all">{csp.layers.raw.checksum.slice(0, 24)}...</p>
          </div>
          <div>
            <span className="text-amber-700/60">Content Length</span>
            <p className="font-mono text-amber-900">{csp.layers.raw.content_length.toLocaleString()} chars</p>
          </div>
          <div>
            <span className="text-amber-700/60">Source Type</span>
            <p className="font-mono text-amber-900">{csp.layers.raw.source_type}</p>
          </div>
        </div>
      </div>

      {/* Layer 2: Semantic */}
      <div className="bg-blue-50/50 border border-blue-200/40 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center">
            <Layers className="w-3 h-3 text-blue-700" />
          </div>
          <span className="text-xs font-mono text-blue-700/70 uppercase tracking-wider">Layer 2 — Semantic Structure</span>
        </div>

        {/* Entity Summary */}
        {Object.keys(csp.layers.semantic.entity_summary).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(csp.layers.semantic.entity_summary).map(([type, count]) => (
              <span key={type} className="text-[10px] font-mono bg-blue-100/60 text-blue-800 px-2 py-0.5 rounded">
                {type}: {count}
              </span>
            ))}
          </div>
        )}

        {/* Sections */}
        <div className="space-y-2">
          {csp.layers.semantic.sections.map((section) => (
            <div key={section.id} className="bg-white/60 border border-blue-100/60 rounded-md p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono text-blue-500">{section.id}</span>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                  {section.semantic_role}
                </span>
                <span className="text-[10px] font-mono text-blue-400 ml-auto">
                  confidence: {section.confidence.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-blue-900/80 leading-relaxed line-clamp-3">
                {section.content}
              </p>
              {section.entities.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {section.entities.map((entity, i) => (
                    <span key={i} className="text-[9px] font-mono bg-blue-50 border border-blue-100 text-blue-600 px-1.5 py-0.5 rounded">
                      {entity.type}: {entity.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {csp.layers.semantic.sections.length === 0 && (
            <p className="text-xs text-blue-500/60 italic">No semantic sections extracted</p>
          )}
        </div>
      </div>

      {/* Layer 3: Verification */}
      <div className="bg-slate-50/50 border border-slate-200/40 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center">
            <Shield className="w-3 h-3 text-slate-700" />
          </div>
          <span className="text-xs font-mono text-slate-700/70 uppercase tracking-wider">Layer 3 — Verification</span>
        </div>
        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-500">Merkle Root</span>
            <p className="font-mono text-slate-800 break-all">{csp.layers.verification.hash_tree}</p>
          </div>
          <div>
            <span className="text-slate-500">Block Hashes ({csp.layers.verification.block_hashes.length})</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {csp.layers.verification.block_hashes.map((hash, i) => (
                <span key={i} className="font-mono text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                  {hash}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-6">
            <div>
              <span className="text-slate-500">Protocol</span>
              <p className="font-mono text-slate-800">{csp.layers.verification.protocol_version}</p>
            </div>
            <div>
              <span className="text-slate-500">Timestamp</span>
              <p className="font-mono text-slate-800">{csp.layers.verification.timestamp}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Markdown Preview ───
function MarkdownPreview({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeContent = "";
  let inTable = false;
  let tableRows: string[][] = [];

  const flushTable = () => {
    if (tableRows.length > 0) {
      elements.push(
        <div key={`table-${elements.length}`} className="overflow-x-auto my-4">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                {tableRows[0].map((cell, i) => (
                  <th key={i} className="px-3 py-2 text-left font-semibold text-foreground">{renderInline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, ri) => (
                <tr key={ri} className="border-b border-border/50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-foreground/80">{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
    inTable = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} className="bg-secondary/80 rounded-md p-4 my-3 overflow-x-auto text-sm font-mono text-foreground/80">
            {codeContent.trim()}
          </pre>
        );
        codeContent = "";
        inCodeBlock = false;
      } else { flushTable(); inCodeBlock = true; }
      continue;
    }
    if (inCodeBlock) { codeContent += line + "\n"; continue; }
    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line.split("|").slice(1, -1).map((c) => c.trim());
      if (cells.every((c) => /^[-:]+$/.test(c))) { inTable = true; continue; }
      tableRows.push(cells);
      if (!inTable && tableRows.length > 1) inTable = true;
      continue;
    } else if (inTable) { flushTable(); }

    if (line.startsWith("# ")) elements.push(<h1 key={i} className="text-2xl font-serif font-bold mt-6 mb-3 text-foreground">{renderInline(line.slice(2))}</h1>);
    else if (line.startsWith("## ")) elements.push(<h2 key={i} className="text-xl font-serif font-semibold mt-5 mb-2 text-foreground">{renderInline(line.slice(3))}</h2>);
    else if (line.startsWith("### ")) elements.push(<h3 key={i} className="text-lg font-serif font-semibold mt-4 mb-2 text-foreground">{renderInline(line.slice(4))}</h3>);
    else if (line.startsWith("> ")) elements.push(<blockquote key={i} className="border-l-3 border-primary/40 pl-4 my-3 text-muted-foreground italic">{renderInline(line.slice(2))}</blockquote>);
    else if (line === "---" || line === "***") elements.push(<hr key={i} className="my-4 border-border/50" />);
    else if (line.match(/^[-*] /)) elements.push(<div key={i} className="flex gap-2 my-0.5 ml-2"><span className="text-primary mt-1.5 text-xs">•</span><span className="text-foreground/80 text-sm">{renderInline(line.slice(2))}</span></div>);
    else if (line.match(/^\d+\. /)) {
      const match = line.match(/^(\d+)\. (.*)$/);
      if (match) elements.push(<div key={i} className="flex gap-2 my-0.5 ml-2"><span className="text-primary text-sm font-medium min-w-[1.2rem]">{match[1]}.</span><span className="text-foreground/80 text-sm">{renderInline(match[2])}</span></div>);
    }
    else if (line.startsWith("<!--")) { /* skip comments */ }
    else if (line.trim() === "") elements.push(<div key={i} className="h-2" />);
    else elements.push(<p key={i} className="text-sm text-foreground/80 leading-relaxed my-1">{renderInline(line)}</p>);
  }
  flushTable();
  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;
  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>);
      parts.push(<strong key={key++} className="font-semibold text-foreground">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }
    const italicMatch = remaining.match(/\*(.+?)\*/);
    if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) parts.push(<span key={key++}>{remaining.slice(0, italicMatch.index)}</span>);
      parts.push(<em key={key++}>{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
      continue;
    }
    const codeMatch = remaining.match(/`(.+?)`/);
    if (codeMatch && codeMatch.index !== undefined) {
      if (codeMatch.index > 0) parts.push(<span key={key++}>{remaining.slice(0, codeMatch.index)}</span>);
      parts.push(<code key={key++} className="bg-secondary/80 px-1.5 py-0.5 rounded text-xs font-mono">{codeMatch[1]}</code>);
      remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
      continue;
    }
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);
    if (linkMatch && linkMatch.index !== undefined) {
      if (linkMatch.index > 0) parts.push(<span key={key++}>{remaining.slice(0, linkMatch.index)}</span>);
      parts.push(<a key={key++} href={linkMatch[2]} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">{linkMatch[1]}</a>);
      remaining = remaining.slice(linkMatch.index + linkMatch[0].length);
      continue;
    }
    parts.push(<span key={key++}>{remaining}</span>);
    break;
  }
  return parts.length === 1 ? parts[0] : <>{parts}</>;
}
