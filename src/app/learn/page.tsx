/**
 * /learn — the curriculum journey dashboard.
 *
 * Server-renders the curriculum index (Tier 1 read from filesystem) and hands
 * it to the client-side <CurriculumJourney /> component that orchestrates the
 * gamified path, progress state, and Scholar Identity card.
 */

import type { Metadata } from "next";
import { getCurriculumIndex } from "@/lib/learning-runtime/curriculum-index";
import { CurriculumJourney } from "@/components/learning-runtime/dashboard/CurriculumJourney";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Learn · Grahvani",
  description: "The gamified curriculum journey — three tiers, twenty-four kṣetras, five hundred and ninety-eight lessons.",
};

export default function LearnDashboardPage() {
  const tiers = getCurriculumIndex();
  return <CurriculumJourney tiers={tiers} />;
}
