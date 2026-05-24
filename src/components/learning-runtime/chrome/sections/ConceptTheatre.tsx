/**
 * §4 Concept Theatre — the body container.
 * Per design constitution §9: each sub-concept gets prose + its interactive scene
 * + the "things I see" reflection prompt. In B3, the prose renders via
 * MarkdownContent; the interactive scenes are wired in B4.
 */

import { MarkdownContent } from "../MarkdownContent";
import { ReflectionPrompt } from "../reading";
import type { ReactNode } from "react";
import type { LessonSection } from "@/lib/learning-runtime/types";

interface ConceptTheatreProps {
  section: LessonSection;
  /** Optional reflection prompts for the end of the section. */
  reflectionPrompts?: string[];
  /** Optional interactive scenes (e.g. BodyMap, Comparator) embedded between the body and the reflection. */
  scenes?: ReactNode;
}

export function ConceptTheatre({ section, reflectionPrompts, scenes }: ConceptTheatreProps) {
  return (
    <section
      id={`sec-${section.number}`}
      className="mx-auto py-5"
      style={{ maxWidth: "880px", scrollMarginTop: "120px" }}
    >
      {/* §4 Body — no explicit "Body" label per design constitution v0.3 §C2.
          The markdown's own `## 4.1` / `### 4.x` headings carry the visible structure.
          Card carries Guru-saffron accent on its left edge — the "teaching" hue per Reform-2. */}
      <div
        className="gl-surface-twilight-glass p-8"
        style={{
          borderLeft: "4px solid #E89E2A",
        }}
      >
        <MarkdownContent noTopMargin>{section.body}</MarkdownContent>
      </div>

      {scenes && <div className="mt-8">{scenes}</div>}

      {reflectionPrompts && reflectionPrompts.length > 0 && (
        <div className="mt-8">
          <ReflectionPrompt
            prompts={reflectionPrompts}
            storageKey={`reflection-sec-${section.number}`}
          />
        </div>
      )}
    </section>
  );
}
