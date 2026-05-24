/**
 * Shared inline-markdown renderer for ALL lesson surfaces.
 *
 * Replaces per-section duplicates. Use this in any component that renders
 * text strings parsed from lesson markdown / front-matter — outcomes, MCQ
 * stems, mistake fields, anchor texts, summary stanzas, etc.
 *
 * Recognises:
 *   **bold**    → semibold in current color
 *   *italic*    → italic Cormorant (same size as surrounding text)
 *   `code`      → italic Cormorant (Sanskrit terms — same as *italic*)
 *   'quoted'    → italic Cormorant with smart curly quotes
 *                 ONLY when the opening apostrophe is at string-start
 *                 or after whitespace/punctuation, AND the closing
 *                 apostrophe is followed by whitespace/punctuation/end.
 *                 This prevents English contractions ("don't", "we're")
 *                 from colliding with each other.
 *
 * The italic emphasis is always rendered in the *current* color of the
 * surrounding text — no chromatic accent inside the prose. This preserves
 * reading rhythm. Italic Cormorant alone carries the semantic weight.
 *
 * Pattern order matters: **bold** must be checked before *italic* otherwise
 * the single-asterisk pattern eats one of the double asterisks.
 */

import type { CSSProperties, ReactNode } from "react";

const ITALIC_STYLE: CSSProperties = {
  fontFamily: "var(--font-cormorant), serif",
  fontStyle: "italic",
  fontWeight: 500,
  // Italic emphasis keeps the surrounding text's size — no 1.05em scaling
  // — so baselines stay aligned mid-sentence. HIG: italic alone carries
  // semantic weight; size changes are reserved for hierarchy.
};

const BOLD_STYLE: CSSProperties = {
  fontWeight: 600,
};

export function renderInline(text: string): ReactNode[] {
  const tokens: ReactNode[] = [];
  // Bold first, then italic, then code, then bracketed-quoted.
  //
  // The bracketed-quote alternative uses (?<=…) and (?=…) so it ONLY
  // matches when the opening `'` is preceded by string-start or by a
  // whitespace / opening-bracket / dash, AND the closing `'` is followed
  // by whitespace / punctuation / string-end. Apostrophes in contractions
  // ("don't think it's") no longer collide and italicise the gap.
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|(?:^|(?<=[\s(\[{—–-]))'([^']+)'(?=[\s.,;:!?)\]}'"—–-]|$)/g;
  let lastIdx = 0;
  let key = 0;
  for (const m of text.matchAll(re)) {
    const at = m.index ?? 0;
    if (at > lastIdx) tokens.push(text.slice(lastIdx, at));
    if (m[1]) {
      tokens.push(
        <strong key={key++} style={BOLD_STYLE}>
          {m[1]}
        </strong>,
      );
    } else if (m[2]) {
      tokens.push(
        <em key={key++} style={ITALIC_STYLE}>
          {m[2]}
        </em>,
      );
    } else if (m[3]) {
      tokens.push(
        <em key={key++} style={ITALIC_STYLE}>
          {m[3]}
        </em>,
      );
    } else if (m[4]) {
      tokens.push(
        <em key={key++} style={ITALIC_STYLE}>
          &lsquo;{m[4]}&rsquo;
        </em>,
      );
    }
    lastIdx = at + m[0].length;
  }
  if (lastIdx < text.length) tokens.push(text.slice(lastIdx));
  return tokens;
}
