"use client";

import React, { useMemo } from "react";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Lightweight markdown-to-HTML renderer tailored for Gautam's 12-section curriculum.
 * Handles: headings, bold, italic, blockquotes, lists, tables, code, horizontal rules.
 */
export default function MarkdownContent({ content, className = "" }: MarkdownContentProps) {
  const html = useMemo(() => markdownToHtml(content), [content]);

  return (
    <div
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function markdownToHtml(md: string): string {
  if (!md) return "";

  let html = escapeHtml(md);

  // Horizontal rules
  html = html.replace(/^\s*---\s*$/gm, '<hr class="markdown-hr" />');

  // Code blocks (```lang\ncode\n```)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, _lang, code) =>
      `<pre class="markdown-pre"><code class="markdown-code">${code.trim()}</code></pre>`
  );

  // Inline code (`code`)
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="markdown-inline-code">$1</code>'
  );

  // Tables
  html = html.replace(
    /((?:^\|.*\|\n?)+)/gm,
    (tableBlock) => {
      const lines = tableBlock.trim().split("\n").filter((l) => l.trim());
      if (lines.length < 2) return tableBlock;
      // Check if second line is separator (|---|---|)
      const isTable = lines[1]?.replace(/[\|\-\s]/g, "").length === 0;
      if (!isTable) return tableBlock;

      const headerCells = parseTableRow(lines[0]);
      const bodyLines = lines.slice(2);

      let tableHtml = '<table class="markdown-table">';
      tableHtml += "<thead><tr>";
      for (const cell of headerCells) {
        tableHtml += `<th class="markdown-th">${cell}</th>`;
      }
      tableHtml += "</tr></thead><tbody>";
      for (const row of bodyLines) {
        const cells = parseTableRow(row);
        tableHtml += "<tr>";
        for (const cell of cells) {
          tableHtml += `<td class="markdown-td">${cell}</td>`;
        }
        tableHtml += "</tr>";
      }
      tableHtml += "</tbody></table>";
      return tableHtml;
    }
  );

  // Blockquotes (> text)
  html = html.replace(
    /(^> .*(?:\n> .*)*)/gm,
    (block) => {
      const inner = block
        .split("\n")
        .map((line) => line.replace(/^>\s?/, ""))
        .join("\n");
      return `<blockquote class="markdown-blockquote">${inner}</blockquote>`;
    }
  );

  // Headings (# §1 Hook, ## 4.1 Title, etc.)
  html = html.replace(
    /^#{6}\s+(.*$)/gim,
    '<h6 class="markdown-h6">$1</h6>'
  );
  html = html.replace(
    /^#{5}\s+(.*$)/gim,
    '<h5 class="markdown-h5">$1</h5>'
  );
  html = html.replace(
    /^#{4}\s+(.*$)/gim,
    '<h4 class="markdown-h4">$1</h4>'
  );
  html = html.replace(
    /^#{3}\s+(.*$)/gim,
    '<h3 class="markdown-h3">$1</h3>'
  );
  html = html.replace(
    /^#{2}\s+(.*$)/gim,
    '<h2 class="markdown-h2">$1</h2>'
  );
  html = html.replace(
    /^#{1}\s+(.*$)/gim,
    '<h1 class="markdown-h1">$1</h1>'
  );

  // Bold (**text**)
  html = html.replace(
    /\*\*([^*]+)\*\*/g,
    '<strong class="markdown-strong">$1</strong>'
  );

  // Italic (*text* — but not inside **)
  html = html.replace(
    /(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g,
    '<em class="markdown-em">$1</em>'
  );

  // Bullet lists (- item)
  html = html.replace(
    /(^-\s+.*(?:\n-\s+.*)*)/gm,
    (listBlock) => {
      const items = listBlock
        .trim()
        .split("\n")
        .map((line) => `<li class="markdown-li">${line.replace(/^-\s+/, "")}</li>`)
        .join("");
      return `<ul class="markdown-ul">${items}</ul>`;
    }
  );

  // Numbered lists (1. item)
  html = html.replace(
    /(^\d+\.\s+.*(?:\n\d+\.\s+.*)*)/gm,
    (listBlock) => {
      const items = listBlock
        .trim()
        .split("\n")
        .map((line) => `<li class="markdown-li">${line.replace(/^\d+\.\s+/, "")}</li>`)
        .join("");
      return `<ol class="markdown-ol">${items}</ol>`;
    }
  );

  // Paragraphs (wrap remaining text blocks)
  const paragraphs = html.split("\n\n").map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    // Don't wrap if already a block element
    if (
      trimmed.startsWith("<") &&
      !trimmed.startsWith("<code>") &&
      !trimmed.startsWith("<em>") &&
      !trimmed.startsWith("<strong>")
    ) {
      return trimmed;
    }
    return `<p class="markdown-p">${trimmed}</p>`;
  });

  html = paragraphs.join("\n");

  // Fix consecutive blockquotes that got split
  html = html.replace(
    /<\/blockquote>\n<blockquote class="markdown-blockquote">/g,
    "\n"
  );

  return html;
}

function parseTableRow(row: string): string[] {
  return row
    .split("|")
    .map((c) => c.trim())
    .filter((c) => c);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
