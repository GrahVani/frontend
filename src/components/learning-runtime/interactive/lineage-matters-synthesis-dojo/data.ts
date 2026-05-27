/**
 * Lineage Matters Synthesis Dojo — L4.3 §7 flagship data.
 *
 * Two views:
 *   1. SYNTHESIS VIEW — the integrated multi-lineage reading per §4.6.
 *   2. EVALUATIVE DRILL — 5 scenarios from §4.7 + §8 common mistakes.
 */

export interface SynthesisSection {
  title: string;
  color: string;
  items: string[];
}

export interface DrillScenario {
  slug: string;
  question: string;
  context?: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const SYNTHESIS_SECTIONS: SynthesisSection[] = [
  {
    title: "Broad-strokes thematic interpretation (high confidence)",
    color: "#3A8C5A",
    items: [
      "Marriage-challenge — convergent across all three approaches: KP 7th-cusp-CSL flags difficulty; BVB Saturn-7th-lord-in-6th + Jupiter-debilitated-7th; Western-Vedic-fusion same Parāśari + Jaiminī foundational",
      "Career-strength — convergent across all three: KP 10th-cusp-CSL supports; BVB 10th-lord-Mars-in-9th = strong dharma-aligned career; Western-Vedic-fusion same foundational analysis",
      "Strong lagna foundation — convergent: KP lagna-cusp-CSL recognises strength; BVB Moon-own-sign-in-1st = strong lagna; Western-Vedic-fusion same Parāśari analysis",
    ],
  },
  {
    title: "Marriage-analysis integration (multi-lineage layers)",
    color: "#C8412E",
    items: [
      "Parāśari foundational layer (BVB + Western-Vedic-fusion): Saturn-7th-lord-in-6th + Jupiter-debilitated-in-7th = substantial marriage-challenge configuration",
      "Jaiminī cross-reference layer (BVB + Western-Vedic-fusion): AK-Saturn suggests delayed-then-stabilised relationship pattern; ārūḍha lagna adds image-of-self-in-the-world dimension",
      "KP precision layer: 7th-cusp-CSL methodology cross-reference for fine-grained event-timing of marriage-related events; stellar refinement provides timing precision Parāśari does not generate",
      "Western-Vedic-fusion developmental layer: psychological-developmental framing presents marriage-challenges as opportunities for personal-development and inner-work",
    ],
  },
  {
    title: "Career-analysis integration (multi-lineage layers)",
    color: "#4F6FA8",
    items: [
      "Parāśari foundational layer: 10th-lord-Mars-in-9th = strong career-and-dharma alignment; D-10 (Daśāmśa) reinforcement cross-checks rāśi assessment",
      "Jaiminī cross-reference layer: AK-Saturn supports long-term + structured + responsibility-oriented career trajectory; cara daśā provides additional time-cycle perspective",
      "KP precision layer: 10th-cusp-CSL + supporting cusp-CSLs for career-event timing precision; stellar refinement for specific promotion/change timing",
      "Western-Vedic-fusion integration layer: life-purpose-and-dharma-integration framing — career as expression of life-purpose aligned with broader Vedic dharma framework",
    ],
  },
  {
    title: "Integrated remedial framework (drawing from all three)",
    color: "#9C7A2F",
    items: [
      "KP-tradition: CSL-significator-strengthening via gemstone + mantra focused on the specific sub-lords supporting marriage and career outcomes",
      "Classical Parāśari śānti: mantras, yantras, gemstones per the analytical findings — Saturn-strengthening + Jupiter-remedial for debility",
      "Jaiminī AK-strengthening: practices supporting the Ātma Kāraka (Saturn) — discipline, structure, long-term commitment practices",
      "Western-Vedic-fusion broader integration: Āyurvedic dietary-and-lifestyle recommendations per chart-based doṣa assessment; yoga-practice integration; meditation-and-spiritual-practice recommendations",
    ],
  },
];

export const DRILL_SCENARIOS: DrillScenario[] = [
  {
    slug: "drill-01",
    question: "A learner observes that the three lineage approaches give different fine-grained analyses of the same chart. They conclude: 'Vedic-astrology is unreliable because lineages disagree.' What is the honest evaluation?",
    options: [
      { id: "A", label: "The learner is correct — lineage disagreement proves Vedic-astrology lacks analytical reliability", isCorrect: false, explanation: "Incorrect. This is Common Mistake #1 + Evaluative Claim 1 from §4.7. The three approaches converge on broad-strokes thematic interpretation (marriage-challenge + career-strength + strong-lagna recognisable across all three) — this convergence IS evidence of reliability at the thematic level. Divergence in fine-grained methodology reflects legitimate methodological diversity, not unreliability." },
      { id: "B", label: "The learner misapplies the convergence-and-divergence pattern — convergence demonstrates reliability; divergence reflects legitimate methodological diversity producing complementary information", isCorrect: true, explanation: "Correct. Per §4.5 + §4.7 Claim 1: broad-strokes convergence demonstrates analytical reliability at the thematic level. Fine-grained divergence reflects each lineage operating at different methodological layers and producing different analytical information. Unique contributions (KP timing precision; BVB classical depth; Western-Vedic-fusion integration) expand rather than contradict analytical capability." },
      { id: "C", label: "The learner is partially correct — some chart configurations are unreliable while others are reliable", isCorrect: false, explanation: "Incorrect. The issue is not 'some configurations are reliable and others are not.' The pattern is systematic: all three approaches converge on the same broad-strokes thematic shape for configurations that are substantively significant. The framework does not produce 'unreliable' configurations — it produces multi-layered analytical information." },
      { id: "D", label: "The learner should stick to one lineage to avoid the confusion of disagreement", isCorrect: false, explanation: "Incorrect. This conflates single-lineage-purist preference with analytical reliability. Single-lineage practice is legitimate but operationally limiting. The disagreement is not confusion — it is multi-layered analytical information. Per §4.6 synthesis discipline and §4.7 Claim 3: primary-lineage-with-substantial-cross-lineage-fluency is the operationally optimal pattern." },
    ],
  },
  {
    slug: "drill-02",
    question: "A practitioner argues: 'Multi-lineage synthesis dilutes each lineage's specific operational accuracy. A practitioner trained in all three lineages is less skilled in any one lineage than a single-lineage practitioner.' What is the honest evaluation?",
    options: [
      { id: "A", label: "The practitioner is correct — depth requires single-lineage purity", isCorrect: false, explanation: "Incorrect. This is Common Mistake #2 + Evaluative Claim 2 from §4.7. It confuses synthesis with collapse. Per §4.6: synthesis honours each lineage's distinctive contribution, preserves per-lineage methodological integrity, and cites per-lineage explicitly. Multi-lineage practitioners have full single-lineage operational accuracy in each lineage they're trained in PLUS additional integrated capability." },
      { id: "B", label: "The practitioner confuses synthesis with collapse — multi-lineage synthesis expands rather than dilutes operational accuracy when performed per the synthesis discipline", isCorrect: true, explanation: "Correct. Per §4.6 + §4.7 Claim 2: synthesis does NOT collapse three lineages into one framework. It operates each lineage's methodology with explicit lineage-flagging and integrates findings per the both-layers-honoured discipline. A practitioner trained in KP + BVB + Western-Vedic-fusion has full KP accuracy (when applying KP) + full BVB accuracy (when applying BVB) + full Western-Vedic-fusion accuracy (when applying WVF) + additional integrated capability. Cross-lineage practitioner mobility (Lesson 1.4.2 §4.9 Pattern 3) is increasingly the norm without accuracy loss." },
      { id: "C", label: "The practitioner is correct for beginners but wrong for advanced practitioners", isCorrect: false, explanation: "Incorrect. The claim is structurally wrong at any level. Beginners may legitimately focus on one lineage for initial training depth, but this is a pedagogical staging decision, not a validation of the 'dilution' claim. At advanced levels, multi-lineage fluency is operationally optimal, not diluting." },
      { id: "D", label: "The curriculum should drop multi-lineage coverage and focus on one lineage to avoid this problem", isCorrect: false, explanation: "Incorrect. The curriculum's multi-lineage coverage is structurally correct per multi-lineage-honesty (Lesson 1.4.2 §4.10) + the synthesis discipline (§4.6). The 'problem' is a misperception, not a real operational issue. Dropping multi-lineage coverage would violate multi-lineage-honesty and deprive learners of cross-lineage operational fluency." },
    ],
  },
  {
    slug: "drill-03",
    question: "A learner asks: 'Should I analyse every chart via all three lineage approaches simultaneously, like the demonstration example?' What is the honest answer?",
    options: [
      { id: "A", label: "Yes — every chart should always be analysed via all three approaches simultaneously for completeness", isCorrect: false, explanation: "Incorrect. This is Common Mistake #3 from §8. The demonstration example illustrates lineage-methodological differences and demonstrates the synthesis discipline — it does NOT prescribe mandatory multi-lineage analysis for every chart. Many chart-analyses appropriately use single-lineage methodology per the analytical question + practitioner training + client cultural-context." },
      { id: "B", label: "No — the demonstration illustrates capability, not prescription; single-lineage analysis is often appropriate per the question, training, and client context", isCorrect: true, explanation: "Correct. Per §4.6 + §4.7 Claim 3 + §8 Common Mistake #3: the synthesis discipline is operationally optimal for serious practitioners WITH multi-lineage training — not mandatory for every chart. Primary-lineage-with-substantial-cross-lineage-fluency is the pattern, not three-lineages-simultaneously-always. The worked example illustrates the framework's capability and demonstrates the synthesis discipline." },
      { id: "C", label: "Only for serious or complex charts — simple charts can use single-lineage analysis", isCorrect: false, explanation: "Incorrect. While this sounds reasonable, it still over-extends the prescription. The decision of which lineage methodology to apply is not determined by 'chart complexity' but by the practitioner's training, the analytical question, and the client context. A simple chart may benefit from multi-lineage cross-reference; a complex chart may be appropriately handled by a single well-trained lineage approach." },
      { id: "D", label: "Only after completing the full curriculum — learners should not attempt multi-lineage analysis until Tier 2", isCorrect: false, explanation: "Incorrect. While the curriculum builds multi-lineage fluency progressively, there is no 'gate' that prevents learners from recognising lineage-methodological differences at any stage. Module 01 itself installs the navigational scaffolding for recognising these differences. The question is about the demonstration example's prescriptive status, not about learner readiness." },
    ],
  },
  {
    slug: "drill-04",
    question: "A learner finishing Module 01 concludes: 'I've completed all 16 lessons — I'm now a trained Vedic-astrology practitioner.' What is the honest framing?",
    options: [
      { id: "A", label: "The learner is correct — Module 01 completion provides full practitioner training", isCorrect: false, explanation: "Incorrect. This is Common Mistake #4 from §8. Module 01 installs the complete navigational scaffolding across four organisational levels — the framework for engagement. Substantive content mastery requires Modules 02-24 (Sanskrit Vocabulary, Gaṇita, Grahas, Rāśis, Bhāvas, Vargas, Nakṣatras, Aspects, Daśās, Yogas, Strength, etc.). Module 01 provides the map; Modules 02-24 build the territory." },
      { id: "B", label: "Module 01 provides navigational orientation, not substantive content mastery — the substantive engagement begins with Modules 02-24", isCorrect: true, explanation: "Correct. Per §6 Recognition 3 + §8 Common Mistake #4 + Lesson 1.3.3 §4.2: Module 01 installs the complete navigational scaffolding — what Vedic-astrology is, how it's organised, who operates within it, how to navigate the landscape. Substantive content mastery requires the remaining 23 modules. The learner has the framework; now the substantive engagement begins." },
      { id: "C", label: "The learner is partially trained — they have theoretical knowledge but lack practical chart-analysis experience", isCorrect: false, explanation: "Incorrect. While the learner does lack practical chart-analysis experience, this framing understates the issue. The problem is not merely 'lack of practice' — it is that Module 01 does not cover the substantive content (graha analysis, bhāva analysis, varga analysis, daśā computation, yoga identification, etc.) that chart-analysis requires. Practice without the substantive content would still not produce competent chart-analysis." },
      { id: "D", label: "The learner should immediately engage a lineage for credentialing since the curriculum portion is complete", isCorrect: false, explanation: "Incorrect. While lineage-engagement is valuable (per Lesson 1.4.2 §4.10), the framing that 'curriculum portion is complete' misrepresents the curriculum's design. The curriculum's Tier 1 contains 24 modules; Module 01 is the navigational foundation. Completing Module 01 does not mean 'curriculum portion complete' — it means 'foundation laid; substantive engagement begins.'" },
    ],
  },
  {
    slug: "drill-05",
    question: "Which of the following best describes the relationship between convergence, divergence, and unique contributions in multi-lineage chart-analysis?",
    options: [
      { id: "A", label: "Convergence and divergence are contradictory — if lineages converge, they should not diverge; if they diverge, they cannot be reliable", isCorrect: false, explanation: "Incorrect. This assumes a single-lineage-purist framework where identical answers are the only marker of reliability. Per §4.5: convergence at broad-strokes AND divergence at fine-grained levels operate simultaneously and are both operationally informative. They are not contradictory — they reflect different analytical layers." },
      { id: "B", label: "Convergence demonstrates reliability at the thematic level; divergence reflects legitimate methodological diversity producing complementary information; unique contributions expand analytical capability beyond any single lineage", isCorrect: true, explanation: "Correct. Per §4.5: the three patterns operate together. Convergence on broad-strokes (marriage-challenge + career-strength + strong-lagna) demonstrates reliability — all three approaches recognise the same thematic shape. Divergence on fine-grained methodology reflects each lineage's distinctive operational lens. Unique contributions (KP timing precision; BVB classical depth; Western-Vedic-fusion integration) add capabilities no single lineage provides. The pattern is expected, informative, and operationally valuable." },
      { id: "C", label: "Convergence is what matters for reliability; divergence and unique contributions are interesting but operationally secondary", isCorrect: false, explanation: "Incorrect. This underweights divergence and unique contributions. Per §4.6 synthesis discipline: the multi-lineage-fluent practitioner integrates ALL three patterns — convergent themes as high-confidence signals, divergent methodology as distinct analytical layers, unique contributions as capability expansion. All three are operationally primary, not secondary." },
      { id: "D", label: "Unique contributions are what matter most; convergence and divergence are merely side effects of lineage differences", isCorrect: false, explanation: "Incorrect. This overweights unique contributions at the expense of convergence and divergence. Convergence is the reliability anchor — without broad-strokes agreement across lineages, the analytical framework would lack grounding. Divergence produces the distinct analytical layers that make multi-lineage practice valuable. All three patterns are structurally integral to the framework." },
    ],
  },
];
