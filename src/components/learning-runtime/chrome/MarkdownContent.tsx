/**
 * Grahvani Learning — Markdown body renderer.
 *
 * Wraps react-markdown with custom React components that conform to the
 * Grahvani Learning design system. Used by section-host primitives to render
 * the markdown body of a §-section.
 *
 * Custom mappings:
 *  - h2/h3       Cormorant gold scholarly headers (lighter than display)
 *  - p           Inter body, generous line-height
 *  - strong      Inter 600 (semantic emphasis)
 *  - em          Cormorant italic (Sanskrit terminology register)
 *  - blockquote  Twilight-glass callout with gold left-border
 *  - table       Inter table with twilight surface + gold hairlines
 *  - code        Inter mono, subtle gold tint
 *  - ul/ol/li    Inter list with gold bullets
 *  - hr          Gold-leaf horizontal divider
 *
 * Used for §1, §2, §3, §4 body, §11 summary primarily. §5 (śloka),
 * §6 (worked example with step reveals), §8 (mistake callouts), §9 (memory
 * anchors), and §10 (MCQ) are rendered by their dedicated section hosts and
 * may bypass this renderer or compose with it.
 */

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Children, isValidElement, type ReactNode } from "react";

/** Walk a children tree and collect its text content. Used by the `em` heuristic. */
function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return Children.toArray(props.children ?? []).map(extractText).join("");
  }
  return "";
}

interface MarkdownContentProps {
  children: string;
  surface?: "dark" | "cream";
  /** Suppress some elements (e.g., set noTopMargin for first-paragraph contexts). */
  noTopMargin?: boolean;
}

export function MarkdownContent({ children, surface = "dark", noTopMargin = false }: MarkdownContentProps) {
  const isDark = surface === "dark";
  const primary = isDark ? "var(--gl-ink-primary)" : "var(--gl-ink-on-cream-primary)";
  const secondary = isDark ? "var(--gl-ink-secondary)" : "var(--gl-ink-on-cream-secondary)";
  const muted = isDark ? "var(--gl-ink-muted)" : "var(--gl-ink-on-cream-muted)";
  const gold = isDark ? "var(--gl-gold-accent)" : "var(--gl-gold-on-cream)";

  return (
    <div
      className="gl-markdown"
      style={{
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        fontSize: "18px",
        lineHeight: 1.65,
        color: primary,
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }: { children?: ReactNode }) => (
            <h2
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 500,
                fontSize: "32px",
                lineHeight: 1.2,
                color: gold,
                marginTop: noTopMargin ? "0" : "36px",
                marginBottom: "16px",
                letterSpacing: "0.005em",
                paddingBottom: "10px",
                borderBottom: `1px solid ${isDark ? "rgba(232, 199, 114, 0.20)" : "rgba(168, 130, 30, 0.20)"}`,
              }}
            >
              {children}
            </h2>
          ),
          h2: ({ children }: { children?: ReactNode }) => (
            <h3
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 600,
                fontSize: "24px",
                lineHeight: 1.3,
                color: gold,
                marginTop: "32px",
                marginBottom: "12px",
              }}
            >
              {children}
            </h3>
          ),
          h3: ({ children }: { children?: ReactNode }) => (
            <h4
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 600,
                fontSize: "20px",
                lineHeight: 1.3,
                color: primary,
                marginTop: "22px",
                marginBottom: "10px",
              }}
            >
              {children}
            </h4>
          ),
          p: ({ children }: { children?: ReactNode }) => (
            <p style={{ marginTop: "14px", marginBottom: "14px", fontSize: "18px", lineHeight: 1.7 }}>{children}</p>
          ),
          strong: ({ children }: { children?: ReactNode }) => (
            <strong style={{ fontWeight: 600, color: primary }}>{children}</strong>
          ),
          em: ({ children }: { children?: ReactNode }) => {
            // Only Sanskrit-likely terms (diacritic OR ≤2 short tokens) get the
            // vermilion treatment. English emphasis stays neutral italic.
            const text = extractText(children);
            const isSanskritLikely =
              /[āīūṛṝḷḹṁṅñṇṭḍṣśḥṃ]/i.test(text) ||
              (text.trim().split(/\s+/).length <= 2 && text.trim().length > 0 && /^[A-Za-zऀ-ॿ]/.test(text.trim()));
            return (
              <em
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: isSanskritLikely ? (isDark ? "#7A2A14" : "#A23A1E") : "inherit",
                  textDecoration: isSanskritLikely ? "underline" : "none",
                  textDecorationColor: isSanskritLikely ? "rgba(162, 58, 30, 0.30)" : "transparent",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "3px",
                }}
              >
                {children}
              </em>
            );
          },
          blockquote: ({ children }: { children?: ReactNode }) => (
            <blockquote
              style={{
                margin: "20px 0",
                padding: "16px 20px",
                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(168,130,30,0.06)",
                borderLeft: `3px solid ${gold}`,
                borderRadius: "0 8px 8px 0",
                color: secondary,
                fontStyle: "normal",
              }}
            >
              {children}
            </blockquote>
          ),
          ul: ({ children }: { children?: ReactNode }) => (
            <ul
              style={{
                marginTop: "12px",
                marginBottom: "16px",
                paddingLeft: "24px",
                listStyleType: "disc",
              }}
            >
              {children}
            </ul>
          ),
          ol: ({ children }: { children?: ReactNode }) => (
            <ol
              style={{
                marginTop: "12px",
                marginBottom: "16px",
                paddingLeft: "24px",
                listStyleType: "decimal",
              }}
            >
              {children}
            </ol>
          ),
          li: ({ children }: { children?: ReactNode }) => (
            <li style={{ marginTop: "6px", marginBottom: "6px", paddingLeft: "4px" }}>{children}</li>
          ),
          hr: () => (
            <hr
              style={{
                margin: "32px auto",
                border: "none",
                height: "2px",
                width: "160px",
                background: `linear-gradient(to right, transparent 0%, ${gold} 50%, transparent 100%)`,
                opacity: 0.6,
              }}
            />
          ),
          pre: ({ children }: { children?: ReactNode }) => (
            <pre
              style={{
                fontFamily: "ui-monospace, SFMono-Regular, monospace",
                fontSize: "0.88em",
                lineHeight: 1.6,
                padding: "16px 20px",
                margin: "20px 0",
                background: isDark ? "rgba(232,199,114,0.08)" : "rgba(168,130,30,0.08)",
                borderRadius: "8px",
                border: `1px solid ${isDark ? "rgba(232,199,114,0.12)" : "rgba(168,130,30,0.15)"}`,
                color: primary,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                overflowX: "hidden",
              }}
            >
              {children}
            </pre>
          ),
          code: ({ children, className }: { children?: ReactNode; className?: string }) => {
            // Fenced code blocks are wrapped in <pre>, so this inline renderer
            // only fires for backtick-inline code *or* the inner <code> of a
            // fenced block. When inside <pre>, inherit styling from parent.
            const isBlock = className?.startsWith("language-");
            return (
              <code
                className={className}
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, monospace",
                  fontSize: isBlock ? "inherit" : "0.92em",
                  padding: isBlock ? "0" : "2px 6px",
                  background: isBlock ? "transparent" : (isDark ? "rgba(232,199,114,0.10)" : "rgba(168,130,30,0.10)"),
                  borderRadius: isBlock ? "0" : "4px",
                  color: gold,
                  whiteSpace: isBlock ? "pre-wrap" : undefined,
                  wordBreak: isBlock ? "break-word" : undefined,
                  overflowWrap: isBlock ? "break-word" : undefined,
                }}
              >
                {children}
              </code>
            );
          },
          table: ({ children }: { children?: ReactNode }) => (
            <div style={{ overflowX: "auto", margin: "20px 0" }}>
              <table
                style={{
                  width: "100%",
                  tableLayout: "fixed",
                  borderCollapse: "collapse",
                  fontSize: "14px",
                  background: isDark ? "rgba(255,255,255,0.02)" : "transparent",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children }: { children?: ReactNode }) => (
            <thead
              style={{
                background: isDark ? "rgba(232,199,114,0.08)" : "rgba(168,130,30,0.12)",
              }}
            >
              {children}
            </thead>
          ),
          th: ({ children }: { children?: ReactNode }) => (
            <th
              style={{
                padding: "10px 12px",
                textAlign: "left",
                fontWeight: 600,
                color: gold,
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                borderBottom: `1px solid var(--gl-gold-hairline)`,
                lineHeight: 1.3,
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }: { children?: ReactNode }) => (
            <td
              style={{
                padding: "7px 10px",
                borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(168,130,30,0.10)"}`,
                verticalAlign: "top",
                lineHeight: 1.45,
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {children}
            </td>
          ),
          a: ({ children, href }: { children?: ReactNode; href?: string }) => (
            <a
              href={href}
              style={{
                color: gold,
                textDecoration: "underline",
                textDecorationStyle: "dotted",
                textUnderlineOffset: "3px",
              }}
            >
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
      <span aria-hidden="true" style={{ display: "none" }}>
        {muted}
      </span>
    </div>
  );
}
