/**
 * §5 Śloka block — classical authority surface.
 * Renders one or more ślokas on Manuscript Cream per design constitution §5.3.
 *
 * For Lesson 1 (slug `jyotisha-as-vedanga`), §5 is rendered by the dedicated
 * SlokaRecitationFrame interactive component (Pāṇinīya Śikṣā 41-42 with
 * tap-to-gloss). For other lessons, B3's structured-śloka parser + Manuscript
 * Cream fallback applies.
 */

import { MarkdownContent } from "../MarkdownContent";
import { Sloka } from "../typography";
import { SlokaRecitationFrame } from "../../interactive/sloka-recitation-frame";
import { SectionHeader } from "../SectionHeader";
import { presentationFor } from "../../lib/section-meta";
import { ScrollText } from "lucide-react";
import type { LessonSection, LessonFrontMatter } from "@/lib/learning-runtime/types";

interface SlokaBlockProps {
  section: LessonSection;
  frontMatter?: LessonFrontMatter;
}

interface ParsedSloka {
  source?: string;
  devanagari: string;
  iast: string;
  english: string;
  commentary?: string;
}

/**
 * Parse ALL structured ślokas in the markdown body. The curriculum standard's
 * §5 template uses a blockquote with labels for Devanāgarī + IAST + English
 * (and optional Brief commentary). A single §5 may contain multiple śloka
 * blocks separated by `---` rules.
 *
 * IMPORTANT: blockquote `> ` prefixes are stripped BEFORE matching so the
 * lookaheads see clean line boundaries and don't over-capture across labels.
 */
function parseAllSlokas(markdown: string): ParsedSloka[] {
  const cleaned = markdown.replace(/^>\s?/gm, "");

  // Split on horizontal rules between śloka blocks (the curriculum's standard
  // separator). Each chunk may contain at most one (Devanāgarī + IAST +
  // English) triplet.
  const chunks = cleaned.split(/\n[-—]{3,}\n/);

  const parsed: ParsedSloka[] = [];
  for (const chunk of chunks) {
    const devMatch = chunk.match(/(?:Devan[āa]gar[īi]|देवनागरी)[^\n]*\n+([\s\S]+?)(?=\n\s*\n|\n\*\*IAST)/i);
    const iastMatch = chunk.match(/\*\*IAST\*\*\s*\n+([\s\S]+?)(?=\n\s*\n|\n\*\*English)/i);
    const enMatch = chunk.match(/\*\*English[^\n]*\*\*\s*\n+([\s\S]+?)(?=\n\s*\n|\n\*\*Brief commentary)/i);
    const commentaryMatch = chunk.match(/\*\*Brief commentary\*\*\s*\n+([\s\S]+?)(?=\n\s*\n|---|$)/i);
    const sourceMatch = chunk.match(/\*\*Classical authority\s*[—-]?\s*([^*]+?)\*\*/i);

    if (devMatch && iastMatch && enMatch) {
      parsed.push({
        source: sourceMatch ? sourceMatch[1].replace(/^\*+|\*+$/g, "").trim() : undefined,
        devanagari: devMatch[1].trim(),
        iast: iastMatch[1].trim(),
        english: enMatch[1].trim(),
        commentary: commentaryMatch ? commentaryMatch[1].trim() : undefined,
      });
    }
  }
  return parsed;
}

export function SlokaBlock({ section, frontMatter }: SlokaBlockProps) {
  const slokas = parseAllSlokas(section.body);
  const useRecitationFrame = frontMatter?.slug === "jyotisha-as-vedanga";
  const pres = presentationFor(section, frontMatter);

  return (
    <section
      id={`sec-${section.number}`}
      aria-labelledby={`sec-${section.number}-h`}
      className="mx-auto py-6"
      style={{ maxWidth: "880px", scrollMarginTop: "120px" }}
    >
      <div style={{ textAlign: "center", marginBottom: "12px" }}>
        <SectionHeader
          eyebrow={pres.eyebrow}
          title={pres.embodiedTitle}
          accentHex={pres.accentHex}
          ornament={<ScrollText size={16} />}
          align="center"
          size="compact"
          tight
        />
      </div>

      {useRecitationFrame ? (
        <SlokaRecitationFrame />
      ) : slokas.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {slokas.map((s, i) => (
            <Sloka
              key={i}
              devanagari={s.devanagari}
              iast={s.iast}
              english={s.english}
              source={s.source}
              commentary={s.commentary}
            />
          ))}
        </div>
      ) : (
        <div className="gl-surface-manuscript">
          <MarkdownContent surface="cream" noTopMargin>
            {section.body}
          </MarkdownContent>
        </div>
      )}
    </section>
  );
}
