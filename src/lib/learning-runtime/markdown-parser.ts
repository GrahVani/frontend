/**
 * Grahvani Learning Runtime — markdown parser.
 *
 * Splits a lesson's markdown body into the twelve §-sections defined by
 * `curriculum/02-lesson-authoring-standard.md` §4.
 *
 * Per `00-design-constitution.md` §21.3, parsing happens at render-time
 * client-side (or in the Next.js server component when rendering the route).
 * The parser is dependency-free for portability across runtimes.
 */

import { classifySection, type LessonSection } from "./types";

/**
 * Match `# §N Title` or `# §N.M Title` heading lines.
 *
 * Examples that match:
 *   # §1 Hook
 *   # §4 Body — the core teaching
 *   # §3.1 What you should know first
 *
 * The leading `#` may be repeated (e.g., `## §4.1 …`) but for the canonical
 * twelve-section template we expect single `#`.
 */
const SECTION_HEADING_RE = /^#+\s+§(\d+(?:\.\d+)?)\s+(.+?)\s*$/gm;

/**
 * Split a markdown body into typed sections. The input is the lesson's body
 * markdown *after* front matter has been stripped.
 *
 * Returns sections in source order. If a section heading is malformed or
 * missing, the parser logs a warning to console but does not throw — the
 * lesson should still render whatever sections were found.
 */
export function splitSections(bodyMarkdown: string): LessonSection[] {
  const sections: LessonSection[] = [];

  // Use matchAll for clean iteration without stateful regex.
  const matches = Array.from(bodyMarkdown.matchAll(SECTION_HEADING_RE)).map((m) => ({
    number: m[1],
    title: m[2].trim(),
    headingStart: m.index ?? 0,
    headingEnd: (m.index ?? 0) + m[0].length,
  }));

  if (matches.length === 0) {
    if (typeof console !== "undefined") {
      console.warn(
        "[learning-runtime] markdown body contained no §-section headings — render will be empty.",
      );
    }
    return [];
  }

  for (let i = 0; i < matches.length; i += 1) {
    const cur = matches[i];
    const next = matches[i + 1];
    const bodyStart = cur.headingEnd;
    const bodyEnd = next ? next.headingStart : bodyMarkdown.length;
    const rawBody = bodyMarkdown.slice(bodyStart, bodyEnd).trim();

    const { group, type } = classifySection(cur.number);

    sections.push({
      number: cur.number,
      title: cur.title,
      body: rawBody,
      group,
      type,
    });
  }

  return sections;
}

/**
 * Lightweight count of new vocabulary terms (italicised text). Used by the
 * runtime to surface a warning if §4 body exceeds the 7±2 cognitive-load
 * ceiling per `01-pedagogical-framework.md` §6. Not used in production
 * rendering; for authoring tools.
 */
export function countItalicTerms(markdown: string): number {
  // Asterisk-italic OR underscore-italic, but exclude bold (`**…**`, `__…__`).
  // Simple heuristic — sufficient for authoring-time linting; not a full parser.
  const matches = markdown.match(/(?<!\*)\*[^*\n]+\*(?!\*)|(?<!_)_[^_\n]+_(?!_)/g);
  return matches ? matches.length : 0;
}
