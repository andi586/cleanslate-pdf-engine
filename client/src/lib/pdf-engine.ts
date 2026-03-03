/**
 * CleanSlate PDF Engine v0.2
 * 
 * Complete rewrite of the PDF-to-Markdown conversion pipeline.
 * Three-layer architecture:
 *   1. Structure Layer: Font-size based heading detection, hierarchical section parsing
 *   2. Table Layer: Spatial column alignment, row grouping, merged cell detection
 *   3. Text Layer: Line-break repair, CJK-Latin mixed text handling, paragraph assembly
 */

import type { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

// ─── Types ───

export interface PDFTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontName: string;
  isBold: boolean;
  isItalic: boolean;
  pageIndex: number;
  transform: number[];
}

export interface TextLine {
  items: PDFTextItem[];
  y: number;
  x: number;
  endX: number;
  pageIndex: number;
  text: string;
  avgFontSize: number;
  maxFontSize: number;
  isBold: boolean;
  isAllCaps: boolean;
}

export interface TableCell {
  text: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

export interface DetectedTable {
  rows: TableCell[][];
  startLineIndex: number;
  endLineIndex: number;
  pageIndex: number;
}

export interface DocumentSection {
  level: number; // 0 = body, 1-6 = heading levels
  heading: string;
  content: string;
  pageIndex: number;
  type: "heading" | "paragraph" | "table" | "list" | "code" | "blockquote";
}

export interface ParseResult {
  markdown: string;
  sections: DocumentSection[];
  pageCount: number;
  metadata: {
    totalCharacters: number;
    totalLines: number;
    totalTables: number;
    languageHint: string;
    processingTimeMs: number;
  };
}

// ─── Constants ───

const LINE_Y_TOLERANCE = 2.5; // pixels tolerance for same-line grouping
const COLUMN_GAP_THRESHOLD = 25; // minimum gap to consider column separation
const TABLE_MIN_COLUMNS = 3; // require at least 3 columns to avoid false positives
const TABLE_MIN_ROWS = 3; // require at least 3 rows
const PARAGRAPH_LINE_GAP_FACTOR = 1.8; // gap > fontSize * factor = new paragraph
const CJK_REGEX = /[\u4e00-\u9fff\u3400-\u4dbf\u3000-\u303f\uff00-\uffef\u2e80-\u2eff\u3040-\u309f\u30a0-\u30ff\uac00-\ud7af]/;
const CJK_PUNCT_REGEX = /[，。！？；：、""''（）【】《》…—～·]/;
const LATIN_REGEX = /[a-zA-Z0-9]/;
const HYPHEN_BREAK_REGEX = /[a-zA-Z]-$/;

// ─── Layer 1: Structure Layer ───

/**
 * Extract positioned text items from a PDF page using pdfjs-dist.
 */
function isTextItem(item: TextItem | TextMarkedContent): item is TextItem {
  return "str" in item && "transform" in item;
}

export function extractTextItems(
  textContent: { items: (TextItem | TextMarkedContent)[] },
  pageIndex: number
): PDFTextItem[] {
  const items: PDFTextItem[] = [];

  for (const item of textContent.items) {
    if (!isTextItem(item)) continue;
    if (!item.str || item.str.trim() === "") continue;

    const transform = item.transform;
    // transform: [scaleX, skewY, skewX, scaleY, translateX, translateY]
    const fontSize = Math.abs(transform[3]) || Math.abs(transform[0]) || 12;
    const x = transform[4];
    const y = transform[5];
    const fontName = (item.fontName || "").toLowerCase();
    const isBold = fontName.includes("bold") || fontName.includes("black") || fontName.includes("heavy");
    const isItalic = fontName.includes("italic") || fontName.includes("oblique");

    items.push({
      str: item.str,
      x,
      y,
      width: item.width || 0,
      height: fontSize,
      fontSize: Math.round(fontSize * 100) / 100,
      fontName: item.fontName || "",
      isBold,
      isItalic,
      pageIndex,
      transform,
    });
  }

  return items;
}

/**
 * Group text items into lines based on Y-coordinate proximity.
 * Items on the same horizontal baseline (within tolerance) form a line.
 */
export function groupIntoLines(items: PDFTextItem[]): TextLine[] {
  if (items.length === 0) return [];

  // Sort by Y descending (PDF coordinates: bottom-up), then X ascending
  const sorted = [...items].sort((a, b) => {
    const yDiff = b.y - a.y;
    if (Math.abs(yDiff) > LINE_Y_TOLERANCE) return yDiff;
    return a.x - b.x;
  });

  const lines: TextLine[] = [];
  let currentLineItems: PDFTextItem[] = [sorted[0]];
  let currentY = sorted[0].y;

  for (let i = 1; i < sorted.length; i++) {
    const item = sorted[i];
    if (Math.abs(item.y - currentY) <= LINE_Y_TOLERANCE) {
      currentLineItems.push(item);
    } else {
      lines.push(buildLine(currentLineItems));
      currentLineItems = [item];
      currentY = item.y;
    }
  }
  if (currentLineItems.length > 0) {
    lines.push(buildLine(currentLineItems));
  }

  return lines;
}

function buildLine(items: PDFTextItem[]): TextLine {
  // Sort items left to right
  items.sort((a, b) => a.x - b.x);

  const fontSizes = items.map((i) => i.fontSize);
  const avgFontSize = fontSizes.reduce((a, b) => a + b, 0) / fontSizes.length;
  const maxFontSize = Math.max(...fontSizes);
  const isBold = items.some((i) => i.isBold);

  // Assemble text with proper spacing
  let text = "";
  for (let i = 0; i < items.length; i++) {
    if (i > 0) {
      const gap = items[i].x - (items[i - 1].x + items[i - 1].width);
      // If gap is significant, add a space; if very large, might be column separator
      if (gap > items[i].fontSize * 0.3) {
        text += " ";
      }
    }
    text += items[i].str;
  }

  const trimmedText = text.trim();
  const isAllCaps = trimmedText.length > 2 && trimmedText === trimmedText.toUpperCase() && /[A-Z]/.test(trimmedText);

  return {
    items,
    y: items[0].y,
    x: items[0].x,
    endX: items[items.length - 1].x + items[items.length - 1].width,
    pageIndex: items[0].pageIndex,
    text: trimmedText,
    avgFontSize: Math.round(avgFontSize * 100) / 100,
    maxFontSize: Math.round(maxFontSize * 100) / 100,
    isBold,
    isAllCaps,
  };
}

/**
 * Analyze font size distribution to determine heading levels.
 * Uses statistical clustering of font sizes.
 */
export function detectHeadingLevels(lines: TextLine[]): Map<number, number> {
  // Collect all font sizes
  const fontSizeCount = new Map<number, number>();
  for (const line of lines) {
    const rounded = Math.round(line.maxFontSize * 2) / 2; // round to 0.5
    fontSizeCount.set(rounded, (fontSizeCount.get(rounded) || 0) + 1);
  }

  // Find body text size (most frequent)
  let bodyFontSize = 12;
  let maxCount = 0;
  Array.from(fontSizeCount.entries()).forEach(([size, count]) => {
    if (count > maxCount) {
      maxCount = count;
      bodyFontSize = size;
    }
  });

  // Get unique sizes larger than body, sorted descending
  const headingSizes = Array.from(fontSizeCount.keys())
    .filter((s) => s > bodyFontSize + 0.5)
    .sort((a, b) => b - a);

  // Map font sizes to heading levels (1-6)
  const sizeToLevel = new Map<number, number>();
  headingSizes.forEach((size, index) => {
    sizeToLevel.set(size, Math.min(index + 1, 6));
  });

  // Also detect bold text at body size as potential sub-headings
  // These get a level based on context
  return sizeToLevel;
}

/**
 * Classify each line as heading, body, table-candidate, list, etc.
 */
export interface ClassifiedLine {
  line: TextLine;
  type: "heading" | "body" | "table-candidate" | "list" | "empty" | "page-number";
  headingLevel: number; // 0 for non-headings
}

export function classifyLines(
  lines: TextLine[],
  sizeToLevel: Map<number, number>
): ClassifiedLine[] {
  // Find body font size
  const fontSizeCounts = new Map<number, number>();
  for (const line of lines) {
    const rounded = Math.round(line.maxFontSize * 2) / 2;
    fontSizeCounts.set(rounded, (fontSizeCounts.get(rounded) || 0) + 1);
  }
  let bodyFontSize = 12;
  let maxCount = 0;
  Array.from(fontSizeCounts.entries()).forEach(([size, count]) => {
    if (count > maxCount) { maxCount = count; bodyFontSize = size; }
  });

  return lines.map((line) => {
    const text = line.text;

    // Empty line
    if (!text || text.trim() === "") {
      return { line, type: "empty" as const, headingLevel: 0 };
    }

    // Page numbers (standalone numbers, often at bottom)
    if (/^\d{1,4}$/.test(text.trim()) && line.items.length <= 2) {
      return { line, type: "page-number" as const, headingLevel: 0 };
    }

    // Bullet list items (but NOT numbered section headings like "1. Executive Summary")
    if (/^[\u2022\u2023\u25E6\u2043\u2219•·‣◦⁃]\s/.test(text) ||
        /^[-*+]\s/.test(text)) {
      return { line, type: "list" as const, headingLevel: 0 };
    }

    // Numbered items: distinguish between list items and section headings
    // "1. Executive Summary" = heading, "1. Install package" in a list context = list
    if (/^\d{1,2}[.)]\s/.test(text)) {
      // If it's short, bold, or has a large font, treat as heading
      const isShortTitle = text.length < 80;
      const hasLargerFont = Math.round(line.maxFontSize * 2) / 2 > bodyFontSize;
      if ((line.isBold || hasLargerFont) && isShortTitle) {
        // Numbered heading like "1. Executive Summary"
        const level = hasLargerFont ? (sizeToLevel.get(Math.round(line.maxFontSize * 2) / 2) || 2) : Math.min(sizeToLevel.size + 1, 3);
        return { line, type: "heading" as const, headingLevel: level };
      }
      // Check if it looks like a section heading by content pattern
      const afterNumber = text.replace(/^\d{1,2}[.)]\s*/, '');
      const wordsCount = afterNumber.split(/\s+/).length;
      if (wordsCount <= 6 && !/[.!?]$/.test(afterNumber)) {
        // Short numbered title without sentence-ending punct
        return { line, type: "heading" as const, headingLevel: Math.min(sizeToLevel.size + 1, 3) };
      }
      return { line, type: "list" as const, headingLevel: 0 };
    }

    // Letter-based list items
    if (/^[a-z][.)]\s/i.test(text) || /^[ivxlcdm]+[.)]\s/i.test(text)) {
      return { line, type: "list" as const, headingLevel: 0 };
    }

    // Heading detection by font size
    const roundedSize = Math.round(line.maxFontSize * 2) / 2;
    const level = sizeToLevel.get(roundedSize);
    if (level) {
      return { line, type: "heading" as const, headingLevel: level };
    }

    // Bold text at body size: only treat as heading if it's clearly a title
    // Must be: bold + short + not ending with sentence punct + not a full sentence
    if (line.isBold && roundedSize >= bodyFontSize - 0.5) {
      const endsWithPunct = /[.!?;:,]$/.test(text);
      const wordsCount = text.split(/\s+/).length;
      // Strict conditions: must be short (< 50 chars or < 8 words) and not end with punct
      if (!endsWithPunct && text.length < 50 && wordsCount <= 8) {
        const subLevel = line.isAllCaps ? Math.min(sizeToLevel.size + 1, 4) : Math.min(sizeToLevel.size + 2, 5);
        return { line, type: "heading" as const, headingLevel: subLevel };
      }
    }

    // All-caps short text is likely a heading (but must be very short)
    if (line.isAllCaps && text.length < 40 && text.length > 2 && text.split(/\s+/).length <= 5) {
      const subLevel = Math.min(sizeToLevel.size + 1, 4);
      return { line, type: "heading" as const, headingLevel: subLevel };
    }

    return { line, type: "body" as const, headingLevel: 0 };
  });
}

// ─── Layer 2: Table Layer ───

/**
 * Detect tables by analyzing column alignment patterns across consecutive lines.
 * A table is a group of lines where text items align into consistent columns.
 */
export function detectTables(lines: TextLine[]): DetectedTable[] {
  const tables: DetectedTable[] = [];
  let i = 0;

  while (i < lines.length) {
    // Try to start a table at line i
    const tableResult = tryDetectTable(lines, i);
    if (tableResult) {
      tables.push(tableResult);
      i = tableResult.endLineIndex + 1;
    } else {
      i++;
    }
  }

  return tables;
}

function isLikelyTableLine(line: TextLine): boolean {
  // A table line should have multiple distinct text segments with significant gaps
  if (line.items.length < 2) return false;
  const sortedItems = [...line.items].sort((a, b) => a.x - b.x);
  let significantGaps = 0;
  for (let i = 1; i < sortedItems.length; i++) {
    const gap = sortedItems[i].x - (sortedItems[i-1].x + sortedItems[i-1].width);
    if (gap > sortedItems[i].fontSize * 2) significantGaps++;
  }
  return significantGaps >= 1;
}

function tryDetectTable(lines: TextLine[], startIdx: number): DetectedTable | null {
  // Need at least TABLE_MIN_ROWS consecutive lines
  if (startIdx + TABLE_MIN_ROWS > lines.length) return null;

  // Pre-filter: check if the starting lines look like table rows
  let tableLikeCount = 0;
  for (let k = startIdx; k < Math.min(startIdx + 5, lines.length); k++) {
    if (isLikelyTableLine(lines[k])) tableLikeCount++;
  }
  if (tableLikeCount < TABLE_MIN_ROWS) return null;

  // Analyze column positions for a window of lines
  const windowSize = Math.min(20, lines.length - startIdx);
  // Only include lines that look like table rows for column analysis
  const candidateLines = lines.slice(startIdx, startIdx + windowSize)
    .filter(l => isLikelyTableLine(l));
  if (candidateLines.length < TABLE_MIN_ROWS) return null;

  const columnPositions = analyzeColumnPositions(candidateLines);
  if (columnPositions.length < TABLE_MIN_COLUMNS) return null;

  // Verify column spacing is consistent (table-like)
  if (columnPositions.length >= 2) {
    const gaps: number[] = [];
    for (let g = 1; g < columnPositions.length; g++) {
      gaps.push(columnPositions[g].xStart - columnPositions[g-1].xEnd);
    }
    // At least some gaps should be positive (real column separation)
    const positiveGaps = gaps.filter(g => g > 5).length;
    if (positiveGaps < 1) return null;
  }

  // Find consecutive lines that match the column pattern
  let endIdx = startIdx;
  let consecutiveMatches = 0;

  for (let j = startIdx; j < startIdx + windowSize; j++) {
    const line = lines[j];
    if (!line || !line.text.trim()) {
      if (consecutiveMatches >= TABLE_MIN_ROWS) break;
      continue;
    }

    // Line must have actual multi-column content
    if (!isLikelyTableLine(line)) {
      if (consecutiveMatches >= TABLE_MIN_ROWS) break;
      if (consecutiveMatches < TABLE_MIN_ROWS) return null;
      continue;
    }

    const lineColumns = getLineColumnAssignments(line, columnPositions);
    if (lineColumns.length >= TABLE_MIN_COLUMNS - 1) {
      consecutiveMatches++;
      endIdx = j;
    } else {
      if (consecutiveMatches >= TABLE_MIN_ROWS) break;
      if (consecutiveMatches < TABLE_MIN_ROWS) return null;
    }
  }

  if (consecutiveMatches < TABLE_MIN_ROWS) return null;

  // Build table structure
  const tableLines = lines.slice(startIdx, endIdx + 1).filter((l) => l.text.trim());
  const rows: TableCell[][] = [];

  for (const line of tableLines) {
    const assignments = getLineColumnAssignments(line, columnPositions);
    const row: TableCell[] = [];

    for (let col = 0; col < columnPositions.length; col++) {
      const cellItems = assignments.filter((a) => a.col === col);
      const cellText = cellItems.map((a) => a.text).join(" ").trim();
      row.push({
        text: cellText,
        row: rows.length,
        col,
        rowSpan: 1,
        colSpan: 1,
      });
    }
    rows.push(row);
  }

  // Detect merged cells (cells that span multiple rows)
  detectMergedCells(rows);

  return {
    rows,
    startLineIndex: startIdx,
    endLineIndex: endIdx,
    pageIndex: lines[startIdx].pageIndex,
  };
}

interface ColumnPosition {
  xStart: number;
  xEnd: number;
  center: number;
}

function analyzeColumnPositions(lines: TextLine[]): ColumnPosition[] {
  // Collect all X-positions of text items
  const xPositions: number[] = [];
  for (const line of lines) {
    for (const item of line.items) {
      xPositions.push(Math.round(item.x));
    }
  }

  if (xPositions.length === 0) return [];

  // Cluster X-positions to find column boundaries
  xPositions.sort((a, b) => a - b);
  const clusters: number[][] = [];
  let currentCluster = [xPositions[0]];

  for (let i = 1; i < xPositions.length; i++) {
    if (xPositions[i] - xPositions[i - 1] <= COLUMN_GAP_THRESHOLD) {
      currentCluster.push(xPositions[i]);
    } else {
      // Require cluster to have items from multiple lines (not just one line)
      if (currentCluster.length >= Math.max(2, Math.floor(lines.length * 0.3))) {
        clusters.push(currentCluster);
      }
      currentCluster = [xPositions[i]];
    }
  }
  if (currentCluster.length >= Math.max(2, Math.floor(lines.length * 0.3))) {
    clusters.push(currentCluster);
  }

  // Convert clusters to column positions
  return clusters.map((cluster) => {
    const min = Math.min(...cluster);
    const max = Math.max(...cluster);
    return {
      xStart: min,
      xEnd: max + 50, // approximate column width
      center: (min + max) / 2,
    };
  });
}

interface ColumnAssignment {
  col: number;
  text: string;
  x: number;
}

function getLineColumnAssignments(
  line: TextLine,
  columns: ColumnPosition[]
): ColumnAssignment[] {
  const assignments: ColumnAssignment[] = [];

  for (const item of line.items) {
    // Find closest column
    let bestCol = 0;
    let bestDist = Infinity;
    for (let c = 0; c < columns.length; c++) {
      const dist = Math.abs(item.x - columns[c].xStart);
      if (dist < bestDist) {
        bestDist = dist;
        bestCol = c;
      }
    }

    // Check if within reasonable distance
    if (bestDist < COLUMN_GAP_THRESHOLD * 2) {
      const existing = assignments.find((a) => a.col === bestCol);
      if (existing) {
        existing.text += " " + item.str;
      } else {
        assignments.push({ col: bestCol, text: item.str, x: item.x });
      }
    }
  }

  return assignments;
}

function detectMergedCells(rows: TableCell[][]): void {
  if (rows.length < 2) return;

  const numCols = rows[0]?.length || 0;

  for (let col = 0; col < numCols; col++) {
    for (let row = 0; row < rows.length - 1; row++) {
      const currentCell = rows[row][col];
      if (!currentCell) continue;

      // Check if next row's same column is empty (potential merged cell)
      let spanCount = 1;
      for (let nextRow = row + 1; nextRow < rows.length; nextRow++) {
        const nextCell = rows[nextRow]?.[col];
        if (nextCell && nextCell.text === "" && hasContentInOtherColumns(rows[nextRow], col)) {
          spanCount++;
        } else {
          break;
        }
      }

      if (spanCount > 1) {
        currentCell.rowSpan = spanCount;
      }
    }
  }
}

function hasContentInOtherColumns(row: TableCell[], excludeCol: number): boolean {
  return row.some((cell, i) => i !== excludeCol && cell.text.trim() !== "");
}

/**
 * Convert a detected table to Markdown format.
 */
export function tableToMarkdown(table: DetectedTable): string {
  if (table.rows.length === 0) return "";

  const numCols = Math.max(...table.rows.map((r) => r.length));
  if (numCols === 0) return "";

  // Normalize rows to have consistent column count
  const normalizedRows = table.rows.map((row) => {
    const cells = [...row];
    while (cells.length < numCols) {
      cells.push({ text: "", row: cells[0]?.row || 0, col: cells.length, rowSpan: 1, colSpan: 1 });
    }
    return cells;
  });

  // Build markdown table
  const lines: string[] = [];

  // Header row
  const headerCells = normalizedRows[0].map((c) => escapeTableCell(c.text));
  lines.push(`| ${headerCells.join(" | ")} |`);

  // Separator
  lines.push(`| ${headerCells.map(() => "---").join(" | ")} |`);

  // Data rows
  for (let i = 1; i < normalizedRows.length; i++) {
    const cells = normalizedRows[i].map((c) => escapeTableCell(c.text));
    lines.push(`| ${cells.join(" | ")} |`);
  }

  return lines.join("\n");
}

function escapeTableCell(text: string): string {
  return text.replace(/\|/g, "\\|").replace(/\n/g, " ").trim() || " ";
}

// ─── Layer 3: Text Layer ───

/**
 * Repair line breaks: join lines that were split mid-sentence.
 * Handles hyphenation, CJK continuation, and Latin sentence flow.
 */
export function repairLineBreaks(lines: ClassifiedLine[]): ClassifiedLine[] {
  const result: ClassifiedLine[] = [];

  for (let i = 0; i < lines.length; i++) {
    const current = lines[i];

    if (current.type !== "body" || !current.line.text.trim()) {
      result.push(current);
      continue;
    }

    // Check if this line should be merged with the previous body line
    if (result.length > 0) {
      const prev = result[result.length - 1];
      if (prev.type === "body" && shouldMergeLines(prev.line, current.line)) {
        // Merge into previous
        const mergedText = mergeLineTexts(prev.line.text, current.line.text);
        prev.line = {
          ...prev.line,
          text: mergedText,
          items: [...prev.line.items, ...current.line.items],
          endX: current.line.endX,
        };
        continue;
      }
    }

    result.push({ ...current });
  }

  return result;
}

function shouldMergeLines(prev: TextLine, current: TextLine): boolean {
  const prevText = prev.text.trim();
  const currText = current.text.trim();

  if (!prevText || !currText) return false;

  // Different pages: don't merge
  if (prev.pageIndex !== current.pageIndex) return false;

  // Very different font sizes: don't merge
  if (Math.abs(prev.avgFontSize - current.avgFontSize) > 1.5) return false;

  // Check Y-gap: if too large, it's a new paragraph
  const yGap = Math.abs(prev.y - current.y);
  const expectedLineHeight = prev.avgFontSize * PARAGRAPH_LINE_GAP_FACTOR;
  if (yGap > expectedLineHeight * 1.5) return false;

  // Hyphenated word break
  if (HYPHEN_BREAK_REGEX.test(prevText)) return true;

  // Previous line doesn't end with sentence-ending punctuation
  const lastChar = prevText[prevText.length - 1];
  const sentenceEnders = ".!?。！？；;:：";
  if (sentenceEnders.includes(lastChar)) return false;

  // CJK: if previous ends with CJK and current starts with CJK, merge
  if (CJK_REGEX.test(lastChar) && CJK_REGEX.test(currText[0])) {
    // But not if previous ends with CJK punctuation
    if (!CJK_PUNCT_REGEX.test(lastChar)) return true;
    return false;
  }

  // Latin: if previous line is shorter than expected full width, likely a paragraph end
  // But if it's close to full width, it's a continuation
  const pageWidth = 600; // approximate
  const lineWidth = prev.endX - prev.x;
  if (lineWidth > pageWidth * 0.7) return true;

  // Previous ends with lowercase letter and current starts with lowercase: continuation
  if (/[a-z,]$/.test(prevText) && /^[a-z]/.test(currText)) return true;

  return false;
}

function mergeLineTexts(prevText: string, currText: string): string {
  const trimmedPrev = prevText.trimEnd();
  const trimmedCurr = currText.trimStart();

  // Handle hyphenation
  if (trimmedPrev.endsWith("-")) {
    // Check if it's a real hyphenated word or a line-break hyphen
    const wordBefore = trimmedPrev.slice(0, -1);
    return wordBefore + trimmedCurr;
  }

  // CJK: no space needed between CJK characters
  const lastChar = trimmedPrev[trimmedPrev.length - 1];
  const firstChar = trimmedCurr[0];
  if (CJK_REGEX.test(lastChar) && CJK_REGEX.test(firstChar)) {
    return trimmedPrev + trimmedCurr;
  }

  // Default: add space
  return trimmedPrev + " " + trimmedCurr;
}

/**
 * Fix CJK-Latin mixed text spacing issues.
 * Adds proper spacing between CJK and Latin characters.
 */
export function fixCJKLatinSpacing(text: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const prevChar = i > 0 ? text[i - 1] : "";
    const nextChar = i < text.length - 1 ? text[i + 1] : "";

    // Add space between CJK and Latin
    if (prevChar && !result.endsWith(" ")) {
      if (
        (CJK_REGEX.test(prevChar) && LATIN_REGEX.test(char)) ||
        (LATIN_REGEX.test(prevChar) && CJK_REGEX.test(char))
      ) {
        result += " ";
      }
    }

    result += char;
  }

  // Remove double spaces
  return result.replace(/  +/g, " ");
}

/**
 * Remove common OCR artifacts and fix encoding issues.
 */
export function cleanOCRArtifacts(text: string): string {
  let cleaned = text;

  // Fix common OCR substitutions
  cleaned = cleaned.replace(/[ﬁ]/g, "fi");
  cleaned = cleaned.replace(/[ﬂ]/g, "fl");
  cleaned = cleaned.replace(/[ﬀ]/g, "ff");
  cleaned = cleaned.replace(/[ﬃ]/g, "ffi");
  cleaned = cleaned.replace(/[ﬄ]/g, "ffl");

  // Fix smart quotes and dashes
  cleaned = cleaned.replace(/[\u2018\u2019]/g, "'");
  cleaned = cleaned.replace(/[\u201C\u201D]/g, '"');
  cleaned = cleaned.replace(/[\u2013]/g, "–");
  cleaned = cleaned.replace(/[\u2014]/g, "—");
  cleaned = cleaned.replace(/[\u2026]/g, "...");

  // Remove zero-width characters
  cleaned = cleaned.replace(/[\u200B\u200C\u200D\uFEFF]/g, "");

  // Fix broken Unicode sequences (common in CJK PDFs)
  cleaned = cleaned.replace(/\s+([，。！？；：、）】》」』])/g, "$1");
  cleaned = cleaned.replace(/([（【《「『])\s+/g, "$1");

  // Remove excessive whitespace
  cleaned = cleaned.replace(/[ \t]+/g, " ");

  return cleaned;
}

// ─── Main Pipeline ───

/**
 * Main PDF-to-Markdown conversion pipeline (v0.2).
 * Processes a PDF file through three layers and produces clean Markdown.
 */
export async function convertPdfToMarkdownV2(file: File): Promise<ParseResult> {
  const startTime = performance.now();

  const arrayBuffer = await file.arrayBuffer();
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  // ═══ Phase 1: Extract all text items with position data ═══
  const allItems: PDFTextItem[] = [];
  const pageLines: TextLine[][] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = extractTextItems(textContent, pageNum - 1);
    allItems.push(...items);

    const lines = groupIntoLines(items);
    pageLines.push(lines);
  }

  // Flatten all lines
  const allLines = pageLines.flat();

  if (allLines.length === 0) {
    return {
      markdown: `# ${file.name}\n\n> *Scanned PDF without extractable text. ${totalPages} pages detected.*`,
      sections: [],
      pageCount: totalPages,
      metadata: {
        totalCharacters: 0,
        totalLines: 0,
        totalTables: 0,
        languageHint: "unknown",
        processingTimeMs: performance.now() - startTime,
      },
    };
  }

  // ═══ Phase 2: Structure Layer — Heading detection ═══
  const sizeToLevel = detectHeadingLevels(allLines);
  const classified = classifyLines(allLines, sizeToLevel);

  // ═══ Phase 3: Table Layer — Detect and extract tables ═══
  const tables = detectTables(allLines);
  const tableLineIndices = new Set<number>();
  for (const table of tables) {
    for (let idx = table.startLineIndex; idx <= table.endLineIndex; idx++) {
      tableLineIndices.add(idx);
    }
  }

  // ═══ Phase 4: Text Layer — Line break repair ═══
  const repairedLines = repairLineBreaks(classified);

  // ═══ Phase 5: Assembly — Build Markdown ═══
  const sections: DocumentSection[] = [];
  const markdownParts: string[] = [];
  let currentPageIndex = -1;
  let lineIndex = 0;

  // Detect language
  const allText = allLines.map((l) => l.text).join(" ");
  const cjkCount = (allText.match(CJK_REGEX) || []).length;
  const latinCount = (allText.match(/[a-zA-Z]/g) || []).length;
  const languageHint = cjkCount > latinCount * 0.3 ? (cjkCount > latinCount ? "zh" : "mixed") : "en";

  // Add document title
  markdownParts.push(`# ${file.name.replace(/\.[^.]+$/, "")}\n`);

  for (let i = 0; i < repairedLines.length; i++) {
    const cl = repairedLines[i];
    const line = cl.line;

    // Skip page numbers
    if (cl.type === "page-number") continue;

    // Skip empty lines (but track for paragraph breaks)
    if (cl.type === "empty") {
      if (markdownParts.length > 0 && !markdownParts[markdownParts.length - 1].endsWith("\n\n")) {
        markdownParts.push("\n");
      }
      continue;
    }

    // Check if this line is part of a table
    // Find the original line index in allLines
    const originalIdx = allLines.findIndex(
      (l) => l.y === line.y && l.pageIndex === line.pageIndex && l.text === line.text
    );
    if (originalIdx >= 0 && tableLineIndices.has(originalIdx)) {
      // Find the table this line belongs to
      const table = tables.find(
        (t) => originalIdx >= t.startLineIndex && originalIdx <= t.endLineIndex
      );
      if (table && originalIdx === table.startLineIndex) {
        // Output the table (only at the start line)
        const tableMd = tableToMarkdown(table);
        markdownParts.push("\n" + tableMd + "\n");
        sections.push({
          level: 0,
          heading: "",
          content: tableMd,
          pageIndex: line.pageIndex,
          type: "table",
        });
      }
      continue; // Skip individual table lines
    }

    // Page break marker
    if (line.pageIndex !== currentPageIndex && currentPageIndex >= 0) {
      // Don't add explicit page breaks, but ensure paragraph separation
      if (!markdownParts[markdownParts.length - 1]?.endsWith("\n\n")) {
        markdownParts.push("\n");
      }
    }
    currentPageIndex = line.pageIndex;

    // Apply text cleaning
    let text = cleanOCRArtifacts(line.text);
    text = fixCJKLatinSpacing(text);

    // Heading
    if (cl.type === "heading" && cl.headingLevel > 0) {
      const prefix = "#".repeat(cl.headingLevel);
      markdownParts.push(`\n${prefix} ${text}\n`);
      sections.push({
        level: cl.headingLevel,
        heading: text,
        content: "",
        pageIndex: line.pageIndex,
        type: "heading",
      });
      continue;
    }

    // List item
    if (cl.type === "list") {
      // Normalize list marker
      let listText = text;
      if (/^[\u2022\u2023\u25E6\u2043\u2219•·‣◦⁃]\s/.test(text)) {
        listText = "- " + text.replace(/^[\u2022\u2023\u25E6\u2043\u2219•·‣◦⁃]\s*/, "");
      }
      markdownParts.push(listText + "\n");
      continue;
    }

    // Body text
    markdownParts.push(text + "\n");

    // Track as section content
    if (sections.length > 0 && sections[sections.length - 1].type === "heading") {
      sections[sections.length - 1].content += text + "\n";
    } else {
      // Standalone paragraph
      const lastSection = sections[sections.length - 1];
      if (lastSection && lastSection.type === "paragraph") {
        lastSection.content += text + "\n";
      } else {
        sections.push({
          level: 0,
          heading: "",
          content: text + "\n",
          pageIndex: line.pageIndex,
          type: "paragraph",
        });
      }
    }
  }

  // Clean up markdown: remove excessive blank lines
  let markdown = markdownParts.join("")
    .replace(/\n{4,}/g, "\n\n\n")
    .replace(/^\n+/, "")
    .trimEnd() + "\n";

  const processingTime = performance.now() - startTime;

  return {
    markdown,
    sections,
    pageCount: totalPages,
    metadata: {
      totalCharacters: markdown.length,
      totalLines: allLines.length,
      totalTables: tables.length,
      languageHint,
      processingTimeMs: Math.round(processingTime),
    },
  };
}
