import type { Metadata } from "next";
import { LearnerDashboardView } from "@/components/learning-runtime/learner-dashboard/LearnerDashboardView";
import { getCurriculumIndex } from "@/lib/learning-runtime/curriculum-index";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Learner Analytics Dashboard · Grahvani",
  description: "Personalized study planner, learning momentum, and AI mentor achievements.",
};

export default function LearnerDashboardPage() {
  const tiers = getCurriculumIndex();
  return <LearnerDashboardView tiers={tiers} />;
}
