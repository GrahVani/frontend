/**
 * /learn/review — Spaced-repetition review surface.
 *
 * Server-renders the curriculum index, then a client component intersects
 * "lessons mastered ≥ 7 days ago" with the curriculum tree to present each
 * review card with its full title, chapter context, and a link back into
 * the lesson so the learner can re-attempt its MCQ.
 *
 * This page exists because the "Today's Review" stat tile on /learn becomes
 * clickable as soon as the deck has items. Until then the tile is decorative
 * and informs the learner why the deck is empty.
 */

import type { Metadata } from "next";
import { getCurriculumIndex } from "@/lib/learning-runtime/curriculum-index";
import { ReviewDeck } from "@/components/learning-runtime/dashboard/ReviewDeck";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Today's Review · Grahvani",
  description: "Reinforce the lessons you mastered more than a week ago.",
};

export default function ReviewDeckPage() {
  const tiers = getCurriculumIndex();
  // Flatten authored lessons across all tiers — we'll filter to "mastered" on the client
  // since mastery lives in the localStorage-backed progress store.
  const allLessons = tiers.flatMap((t) =>
    t.modules.flatMap((mod) =>
      mod.chapters.flatMap((ch) =>
        ch.lessons.filter((l) => l.isAuthored).map((l) => ({
          slug: l.slug,
          canonicalSlug: l.canonicalSlug,
          title: l.title,
          href: l.href,
          chapterTitle: ch.title,
          chapterSequence: ch.sequence,
          moduleTitle: mod.title,
          moduleSequence: mod.sequence,
          targetMinutes: l.targetMinutes,
          bloomLevels: l.bloomLevels,
        })),
      ),
    ),
  );
  return <ReviewDeck lessons={allLessons} />;
}
