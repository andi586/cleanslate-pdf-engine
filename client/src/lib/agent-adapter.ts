/**
 * CleanSlate Protocol — AI Agent Adapter (v0.3)
 *
 * Transforms CSP output into formats optimized for AI Agent consumption.
 * Supports multiple output modes for different agent architectures.
 *
 * Usage:
 *   import { toAgentInput, toAgentPrompt, toAgentSummaryPrompt } from "@/lib/agent-adapter";
 *   const agentInput = toAgentInput(cspData);
 *   const prompt = toAgentPrompt(cspData, "Summarize this document");
 */

import type { CSPOutput, CSPSection } from "./parser";

// ─── Agent Input Types ───

export interface AgentInputSection {
  type: string;
  text: string;
  confidence: number;
  entities: Array<{ type: string; value: string }>;
}

export interface AgentInput {
  role: "document";
  document_id: string;
  title: string;
  language: string;
  checksum: string;
  data: AgentInputSection[];
  summary: {
    total_sections: number;
    total_entities: number;
    semantic_roles: string[];
  };
}

// ─── Core: Transform CSP to Agent Input ───

export function toAgentInput(cspData: CSPOutput): AgentInput {
  const allEntities = cspData.content.sections.flatMap((s) => s.entities);
  const roles = Array.from(new Set(cspData.content.sections.map((s) => s.semantic_role)));

  return {
    role: "document",
    document_id: cspData.metadata.document_id,
    title: cspData.metadata.title,
    language: cspData.metadata.language,
    checksum: cspData.document.checksum,
    data: cspData.content.sections.map((s: CSPSection) => ({
      type: s.semantic_role,
      text: s.content,
      confidence: s.confidence,
      entities: s.entities,
    })),
    summary: {
      total_sections: cspData.content.sections.length,
      total_entities: allEntities.length,
      semantic_roles: roles,
    },
  };
}

// ─── Generate Agent System Prompt ───

export function toAgentPrompt(cspData: CSPOutput, instruction: string): string {
  const agentInput = toAgentInput(cspData);
  const sectionsText = agentInput.data
    .map((s, i) => `[Section ${i + 1} | ${s.type}]\n${s.text}`)
    .join("\n\n");

  return [
    `## Document: ${agentInput.title}`,
    `Language: ${agentInput.language} | Sections: ${agentInput.summary.total_sections} | Entities: ${agentInput.summary.total_entities}`,
    `Checksum: ${agentInput.checksum}`,
    "",
    "---",
    "",
    sectionsText,
    "",
    "---",
    "",
    `## Instruction`,
    instruction,
  ].join("\n");
}

// ─── Generate Summary Prompt ───

export function toAgentSummaryPrompt(cspData: CSPOutput): string {
  return toAgentPrompt(
    cspData,
    [
      "Summarize the following document sections:",
      "",
      "1. Provide a concise executive summary (2-3 sentences)",
      "2. List the key findings or main points",
      "3. Identify any notable entities (dates, amounts, organizations)",
      "4. Rate the document's completeness and clarity",
      "",
      "Format your response as structured JSON with keys: summary, key_points, entities, quality_score",
    ].join("\n")
  );
}

// ─── Generate Flat Text for Simple Agents ───

export function toFlatText(cspData: CSPOutput): string {
  return cspData.content.sections
    .map((s) => s.content)
    .join("\n\n");
}
