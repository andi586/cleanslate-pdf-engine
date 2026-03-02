/*
 * CleanSlate AI - Converter Page
 * Design: Wabi-Sabi + Swiss Internationalism
 * Layout: Split view - left dropzone, right markdown preview
 * Colors: Warm white bg, deep ink text, indigo accents
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
} from "lucide-react";

// Supported file types and their icons
const FILE_TYPE_MAP: Record<string, { icon: typeof FileText; label: string }> = {
  "application/pdf": { icon: FileType, label: "PDF" },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { icon: FileText, label: "DOCX" },
  "application/msword": { icon: FileText, label: "DOC" },
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": { icon: Table, label: "XLSX" },
  "application/vnd.ms-excel": { icon: Table, label: "XLS" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { icon: Presentation, label: "PPTX" },
  "application/vnd.ms-powerpoint": { icon: Presentation, label: "PPT" },
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

// Client-side file conversion engine
async function convertFileToMarkdown(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const type = file.type;

  // Plain text files
  if (type.startsWith("text/") || ["txt", "md", "csv", "html", "htm", "rtf"].includes(ext)) {
    const text = await file.text();
    if (ext === "csv" || type === "text/csv") {
      return convertCsvToMarkdown(text, file.name);
    }
    if (ext === "html" || ext === "htm" || type === "text/html") {
      return convertHtmlToMarkdown(text, file.name);
    }
    if (ext === "md") {
      return `<!-- Source: ${file.name} -->\n\n${text}`;
    }
    return `# ${file.name}\n\n${text}`;
  }

  // JSON files
  if (type === "application/json" || ext === "json") {
    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      return `# ${file.name}\n\n\`\`\`json\n${JSON.stringify(parsed, null, 2)}\n\`\`\``;
    } catch {
      return `# ${file.name}\n\n\`\`\`\n${text}\n\`\`\``;
    }
  }

  // Image files - extract metadata and provide base64
  if (type.startsWith("image/")) {
    return await convertImageToMarkdown(file);
  }

  // For binary formats (PDF, DOCX, XLSX, PPTX), we do client-side extraction
  if (ext === "pdf" || type === "application/pdf") {
    return await convertPdfToMarkdown(file);
  }

  // For other binary formats, provide a structured placeholder with file info
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
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        cells.push(current.trim());
        current = "";
      } else {
        current += char;
      }
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
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent?.replace(/\s+/g, " ") || "";
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const el = node as Element;
    const tag = el.tagName.toLowerCase();
    const children = Array.from(el.childNodes).map(nodeToMd).join("");

    switch (tag) {
      case "h1": return `\n# ${children.trim()}\n`;
      case "h2": return `\n## ${children.trim()}\n`;
      case "h3": return `\n### ${children.trim()}\n`;
      case "h4": return `\n#### ${children.trim()}\n`;
      case "h5": return `\n##### ${children.trim()}\n`;
      case "h6": return `\n###### ${children.trim()}\n`;
      case "p": return `\n${children.trim()}\n`;
      case "br": return "\n";
      case "strong": case "b": return `**${children.trim()}**`;
      case "em": case "i": return `*${children.trim()}*`;
      case "code": return `\`${children.trim()}\``;
      case "pre": return `\n\`\`\`\n${children.trim()}\n\`\`\`\n`;
      case "a": {
        const href = el.getAttribute("href") || "";
        return `[${children.trim()}](${href})`;
      }
      case "img": {
        const src = el.getAttribute("src") || "";
        const alt = el.getAttribute("alt") || "image";
        return `![${alt}](${src})`;
      }
      case "ul": return `\n${children}`;
      case "ol": return `\n${children}`;
      case "li": {
        const parent = el.parentElement?.tagName.toLowerCase();
        const prefix = parent === "ol" ? "1." : "-";
        return `${prefix} ${children.trim()}\n`;
      }
      case "blockquote": return `\n> ${children.trim()}\n`;
      case "hr": return "\n---\n";
      case "table": return convertTableElement(el);
      case "script": case "style": case "noscript": return "";
      default: return children;
    }
  }

  function convertTableElement(table: Element): string {
    const rows = table.querySelectorAll("tr");
    if (rows.length === 0) return "";

    const mdRows: string[] = [];
    rows.forEach((row, i) => {
      const cells = Array.from(row.querySelectorAll("th, td")).map(
        (cell) => cell.textContent?.trim() || ""
      );
      mdRows.push(`| ${cells.join(" | ")} |`);
      if (i === 0) {
        mdRows.push(`| ${cells.map(() => "---").join(" | ")} |`);
      }
    });
    return `\n${mdRows.join("\n")}\n`;
  }

  const title = doc.querySelector("title")?.textContent || filename;
  const body = doc.body ? nodeToMd(doc.body) : "";
  const cleaned = body.replace(/\n{3,}/g, "\n\n").trim();

  return `# ${title}\n\n${cleaned}`;
}

async function convertImageToMarkdown(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const md = [
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
          `> *Image loaded successfully. For OCR text extraction from images, use the desktop CLI version of CleanSlate AI.*`,
        ].join("\n");
        resolve(md);
      };
      img.onerror = () => {
        resolve(`# ${file.name}\n\n*Could not load image preview.*`);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

async function convertPdfToMarkdown(file: File): Promise<string> {
  // Use pdf.js for client-side PDF text extraction
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
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (pageText) {
        pages.push(`## Page ${i}\n\n${pageText}`);
      }
    }

    if (pages.length === 0) {
      return `# ${file.name}\n\n> *This PDF appears to contain scanned images without extractable text. For OCR support, use the desktop CLI version of CleanSlate AI.*\n\n| Property | Value |\n| --- | --- |\n| **Pages** | ${totalPages} |\n| **Size** | ${formatFileSize(file.size)} |`;
    }

    return `# ${file.name}\n\n> *${totalPages} pages extracted*\n\n${pages.join("\n\n---\n\n")}`;
  } catch (error) {
    return `# ${file.name}\n\n> *PDF text extraction encountered an error. The file may be encrypted or corrupted.*\n\n| Property | Value |\n| --- | --- |\n| **Size** | ${formatFileSize(file.size)} |\n| **Error** | ${error instanceof Error ? error.message : "Unknown error"} |`;
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
    `> *This file format (${ext.toUpperCase()}) requires the desktop CLI version of CleanSlate AI for full content extraction. The web version supports: TXT, CSV, HTML, PDF, JSON, and image files.*`,
  ].join("\n");
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function Converter() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<Map<string, string>>(new Map());
  const [converting, setConverting] = useState<Set<string>>(new Set());
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        addFiles(droppedFiles);
      }
    },
    [files]
  );

  const addFiles = useCallback(
    async (newFiles: File[]) => {
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);

      // Auto-select first file if none selected
      if (!activeFile && newFiles.length > 0) {
        setActiveFile(newFiles[0].name);
      }

      // Convert all new files
      for (const file of newFiles) {
        setConverting((prev) => new Set(prev).add(file.name));
        try {
          const markdown = await convertFileToMarkdown(file);
          setResults((prev) => new Map(prev).set(file.name, markdown));
        } catch (error) {
          setResults((prev) =>
            new Map(prev).set(
              file.name,
              `# Error\n\nFailed to convert ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`
            )
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
      setResults((prev) => {
        const next = new Map(prev);
        next.delete(filename);
        return next;
      });
      if (activeFile === filename) {
        setActiveFile(files.find((f) => f.name !== filename)?.name || null);
      }
    },
    [activeFile, files]
  );

  const copyToClipboard = useCallback(async () => {
    if (!activeFile || !results.has(activeFile)) return;
    try {
      await navigator.clipboard.writeText(results.get(activeFile)!);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, [activeFile, results]);

  const copyAllToClipboard = useCallback(async () => {
    const allMarkdown = Array.from(results.values()).join("\n\n---\n\n");
    try {
      await navigator.clipboard.writeText(allMarkdown);
      toast.success("All files copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  }, [results]);

  const downloadMarkdown = useCallback(() => {
    if (!activeFile || !results.has(activeFile)) return;
    const blob = new Blob([results.get(activeFile)!], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.replace(/\.[^.]+$/, ".md");
    a.click();
    URL.revokeObjectURL(url);
  }, [activeFile, results]);

  const downloadAll = useCallback(() => {
    const allMarkdown = Array.from(results.entries())
      .map(([name, md]) => `<!-- File: ${name} -->\n\n${md}`)
      .join("\n\n---\n\n");
    const blob = new Blob([allMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cleanslate-output.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [results]);

  const currentMarkdown = activeFile ? results.get(activeFile) || "" : "";
  const isConverting = activeFile ? converting.has(activeFile) : false;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310419663031399163/fUqHMuaqwhHMQAT4LsRcyA/paper-texture-KujUNu3zKcfgHbtiuje7Mx.webp)`, backgroundSize: '400px', backgroundRepeat: 'repeat' }}>
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
            <h1 className="text-lg font-serif font-semibold tracking-tight text-foreground">
              CleanSlate
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {results.size > 1 && (
              <>
                <Button variant="outline" size="sm" onClick={copyAllToClipboard} className="text-xs bg-transparent">
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy All
                </Button>
                <Button variant="outline" size="sm" onClick={downloadAll} className="text-xs bg-transparent">
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Download All
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel - File List & Drop Zone */}
        <div className="w-full lg:w-80 xl:w-96 border-r border-border/50 flex flex-col bg-background/60 backdrop-blur-sm">
          {/* Drop Zone */}
          <div
            className={`m-3 border-2 border-dashed rounded-lg transition-all duration-300 ${
              isDragging
                ? "border-primary bg-accent/50 scale-[0.98]"
                : "border-border/60 hover:border-primary/40"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
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
              <p className="text-sm font-medium text-foreground mb-1">
                Drop files here
              </p>
              <p className="text-xs text-muted-foreground text-center">
                PDF, DOCX, XLSX, PPTX, HTML, CSV, TXT, Images
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.html,.htm,.txt,.csv,.md,.rtf,.json,.png,.jpg,.jpeg,.webp,.gif,.bmp"
              onChange={(e) => {
                if (e.target.files) {
                  addFiles(Array.from(e.target.files));
                  e.target.value = "";
                }
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
                const isDone = results.has(file.name);

                return (
                  <motion.div
                    key={file.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-md mb-1 cursor-pointer transition-all ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-secondary/60"
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
                        {isDone && !isFileConverting && " · Done"}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.name);
                      }}
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
                <FileText className="w-10 h-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">No files yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Drop or browse to get started
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Markdown Output */}
        <div className="flex-1 flex flex-col min-h-0">
          {activeFile && currentMarkdown ? (
            <>
              {/* Output Header */}
              <div className="border-b border-border/50 bg-background/60 backdrop-blur-sm px-4 py-2 flex items-center justify-between">
                <Tabs defaultValue="preview" className="w-full">
                  <div className="flex items-center justify-between">
                    <TabsList className="h-8 bg-secondary/50">
                      <TabsTrigger value="preview" className="text-xs h-6 px-3">
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="raw" className="text-xs h-6 px-3">
                        Raw Markdown
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="h-7 text-xs bg-transparent"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 mr-1 text-green-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 mr-1" />
                        )}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadMarkdown}
                        className="h-7 text-xs bg-transparent"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" />
                        .md
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="preview" className="mt-0">
                    <div className="p-6 max-w-3xl mx-auto prose prose-sm prose-slate">
                      <MarkdownPreview content={currentMarkdown} />
                    </div>
                  </TabsContent>

                  <TabsContent value="raw" className="mt-0">
                    <pre className="p-6 text-sm font-mono text-foreground/80 whitespace-pre-wrap break-words overflow-auto max-h-[calc(100vh-10rem)]">
                      {currentMarkdown}
                    </pre>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          ) : isConverting ? (
            <div className="flex-1 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Converting...</p>
              </motion.div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-sm">
                <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-muted-foreground/50" />
                </div>
                <h3 className="font-serif text-lg text-foreground mb-2">
                  Ready to transform
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Drop your documents on the left panel. CleanSlate will convert them into clean, AI-friendly Markdown — entirely in your browser.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Simple Markdown preview component
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
                  <th key={i} className="px-3 py-2 text-left font-semibold text-foreground">
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, ri) => (
                <tr key={ri} className="border-b border-border/50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-foreground/80">
                      {renderInline(cell)}
                    </td>
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

    // Code blocks
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} className="bg-secondary/80 rounded-md p-4 my-3 overflow-x-auto text-sm font-mono text-foreground/80">
            {codeContent.trim()}
          </pre>
        );
        codeContent = "";
        inCodeBlock = false;
      } else {
        flushTable();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + "\n";
      continue;
    }

    // Table rows
    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line.split("|").slice(1, -1).map((c) => c.trim());
      // Skip separator rows
      if (cells.every((c) => /^[-:]+$/.test(c))) {
        inTable = true;
        continue;
      }
      if (!inTable && tableRows.length === 0) {
        tableRows.push(cells);
        continue;
      }
      tableRows.push(cells);
      inTable = true;
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headings
    if (line.startsWith("# ")) {
      elements.push(<h1 key={i} className="text-2xl font-serif font-bold mt-6 mb-3 text-foreground">{renderInline(line.slice(2))}</h1>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-xl font-serif font-semibold mt-5 mb-2 text-foreground">{renderInline(line.slice(3))}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-lg font-serif font-semibold mt-4 mb-2 text-foreground">{renderInline(line.slice(4))}</h3>);
    } else if (line.startsWith("#### ")) {
      elements.push(<h4 key={i} className="text-base font-serif font-semibold mt-3 mb-1 text-foreground">{renderInline(line.slice(5))}</h4>);
    }
    // Blockquotes
    else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-3 border-primary/40 pl-4 my-3 text-muted-foreground italic">
          {renderInline(line.slice(2))}
        </blockquote>
      );
    }
    // Horizontal rule
    else if (line === "---" || line === "***" || line === "___") {
      elements.push(<hr key={i} className="my-4 border-border/50" />);
    }
    // List items
    else if (line.match(/^[-*] /)) {
      elements.push(
        <div key={i} className="flex gap-2 my-0.5 ml-2">
          <span className="text-primary mt-1.5 text-xs">•</span>
          <span className="text-foreground/80 text-sm">{renderInline(line.slice(2))}</span>
        </div>
      );
    }
    // Ordered list
    else if (line.match(/^\d+\. /)) {
      const match = line.match(/^(\d+)\. (.*)$/);
      if (match) {
        elements.push(
          <div key={i} className="flex gap-2 my-0.5 ml-2">
            <span className="text-primary text-sm font-medium min-w-[1.2rem]">{match[1]}.</span>
            <span className="text-foreground/80 text-sm">{renderInline(match[2])}</span>
          </div>
        );
      }
    }
    // Comments
    else if (line.startsWith("<!--")) {
      // Skip HTML comments
    }
    // Empty lines
    else if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
    }
    // Regular paragraphs
    else {
      elements.push(
        <p key={i} className="text-sm text-foreground/80 leading-relaxed my-1">
          {renderInline(line)}
        </p>
      );
    }
  }

  flushTable();

  return <>{elements}</>;
}

function renderInline(text: string): React.ReactNode {
  // Simple inline markdown rendering
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>);
      }
      parts.push(<strong key={key++} className="font-semibold text-foreground">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }

    // Italic
    const italicMatch = remaining.match(/\*(.+?)\*/);
    if (italicMatch && italicMatch.index !== undefined) {
      if (italicMatch.index > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, italicMatch.index)}</span>);
      }
      parts.push(<em key={key++}>{italicMatch[1]}</em>);
      remaining = remaining.slice(italicMatch.index + italicMatch[0].length);
      continue;
    }

    // Inline code
    const codeMatch = remaining.match(/`(.+?)`/);
    if (codeMatch && codeMatch.index !== undefined) {
      if (codeMatch.index > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, codeMatch.index)}</span>);
      }
      parts.push(
        <code key={key++} className="bg-secondary/80 px-1.5 py-0.5 rounded text-xs font-mono">
          {codeMatch[1]}
        </code>
      );
      remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
      continue;
    }

    // Links
    const linkMatch = remaining.match(/\[(.+?)\]\((.+?)\)/);
    if (linkMatch && linkMatch.index !== undefined) {
      if (linkMatch.index > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, linkMatch.index)}</span>);
      }
      parts.push(
        <a key={key++} href={linkMatch[2]} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">
          {linkMatch[1]}
        </a>
      );
      remaining = remaining.slice(linkMatch.index + linkMatch[0].length);
      continue;
    }

    // No more matches
    parts.push(<span key={key++}>{remaining}</span>);
    break;
  }

  return parts.length === 1 ? parts[0] : <>{parts}</>;
}
