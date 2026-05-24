/**
 * §6 Worked Example — step-revealed narrative.
 *
 * For B3: renders the markdown body of §6 inside a twilight-glass card.
 * Step-by-step reveal (where the learner clicks "next step" to advance) is a
 * polish pass — B4 may add it for the conceptual lesson 1, which is mostly
 * prose worked examples without computational steps.
 */

import { MarkdownContent } from "../MarkdownContent";
import { SectionHeader } from "../SectionHeader";
import { presentationFor } from "../../lib/section-meta";
import { ListChecks } from "lucide-react";
import type { LessonSection } from "@/lib/learning-runtime/types";

interface WorkedExampleProps {
  section: LessonSection;
}

export function WorkedExample({ section }: WorkedExampleProps) {
  // Lesson 1 (conceptual) may have "N/A" in §6. Render only if there is content.
  const isEmpty =
    section.body.trim().length === 0 ||
    /^\*?\s*N\/A/i.test(section.body.trim()) ||
    section.body.trim().startsWith("*N/A");

  // §6 is N/A for conceptual lessons — hide entirely so the divider above it
  // doesn't render an empty hole. The lesson route's IntersectionObserver
  // still sees the rail node, but there's no body content to read.
  if (isEmpty) {
    return (
      <section
        id={`sec-${section.number}`}
        aria-hidden="true"
        style={{ display: "none" }}
      />
    );
  }

  return (
    <section
      id={`sec-${section.number}`}
      aria-labelledby={`sec-${section.number}-h`}
      className="mx-auto py-5"
      style={{ maxWidth: "880px", scrollMarginTop: "120px" }}
    >
      {(() => {
        const pres = presentationFor(section);
        return (
          <SectionHeader
            eyebrow={pres.eyebrow}
            title={pres.embodiedTitle}
            accentHex={pres.accentHex}
            ornament={<ListChecks size={16} />}
            size="compact"
          />
        );
      })()}
      <div className="gl-surface-twilight-glass p-8">
        <MarkdownContent noTopMargin>{section.body}</MarkdownContent>
      </div>
    </section>
  );
}
