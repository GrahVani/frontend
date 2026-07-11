"use client";

import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { CheckCircle2, AlertTriangle, ArrowRight, BookOpen, AlertCircle, RefreshCw, XCircle } from "lucide-react";

const STAGES = [
  {
    id: 1,
    title: "Route",
    description: "Are we testing the same question on substrate?",
    finding: "Parāśarī, KP target 7th house identically. Jaimini Dārakāraka, Lal Kitab Teva Box 4, and Tājika Muntha all route to the same factor. All five streams are genuinely routed here."
  },
  {
    id: 2,
    title: "Weight",
    description: "What sub-question does each stream answer best?",
    finding: "KP is weighted for 'whether' (binary pass/fail). Parāśarī is weighted for 'what-is-it-like' (ease and strength)."
  },
  {
    id: 3,
    title: "Classify",
    description: "Sorting the streams into roles.",
    finding: "Parāśarī & KP: Verdict-bearing. Jaimini & Lal Kitab: Corroborating (substrate). Tājika: Partial substrate + timing."
  },
  {
    id: 4,
    title: "Check",
    description: "Verify divergences and convergences.",
    finding: "Verdict: Parāśarī (weak-to-moderate) and KP (clean YES) genuinely diverge. Substrate: 4 full convergences on Saturn + 1 partial. Timing: Parāśarī and Tājika converge within 49 days."
  },
  {
    id: 5,
    title: "Resolve",
    description: "How to frame this to a real client?",
    finding: "Report both findings honestly by name and weight. State the actionable takeaway (confirm birth time) to sharpen the KP margin."
  },
  {
    id: 6,
    title: "Rank",
    description: "Final statement composition weighting.",
    finding: "Verdict divergence placed in prominent Confidence section. Substrate convergence supports Indicators. Timing earns mention in Confidence scaled as support."
  }
];

export default function WorkedSynthesisMarriageQuestion5Streams() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showProbabilityTrap, setShowProbabilityTrap] = useState(false);

  // Helper to determine if a section of the statement is visible based on the current step
  const isVisible = (stepRequired: number) => currentStep >= stepRequired;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-6 p-4">
      {/* Left Pane: Sequence Stepper */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 border-r border-slate-200 pr-4">
        <div className="mb-2">
          <h3 className="text-xl font-medium text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            The 6-Step Sequence
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Step through Chart MD1's marriage question to populate the composed statement.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {STAGES.map((stage) => {
            const isActive = currentStep === stage.id;
            const isCompleted = currentStep > stage.id;

            return (
              <div
                key={stage.id}
                className={`p-3 rounded-md transition-colors ${isActive ? "bg-indigo-50 border border-indigo-200" :
                    isCompleted ? "bg-slate-50 border border-slate-200 opacity-80" :
                      "bg-white border border-slate-100 opacity-50"
                  }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isActive ? (
                    <RefreshCw className="w-4 h-4 text-indigo-600 animate-[spin_3s_linear_infinite]" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                  )}
                  <h4 className="text-base font-medium text-slate-800">
                    Step {stage.id}: {stage.title}
                  </h4>
                </div>

                {(isActive || isCompleted) && (
                  <div className="ml-6 mt-2 text-sm text-slate-700 space-y-1">
                    <p className="italic text-slate-500">{stage.description}</p>
                    <p>{stage.finding}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          {currentStep > 0 && (
            <Button variant="ghost" onClick={() => setCurrentStep(prev => prev - 1)}>
              Previous
            </Button>
          )}
          {currentStep < 6 ? (
            <Button variant="primary" className="flex-1 flex items-center justify-center gap-2" onClick={() => setCurrentStep(prev => prev + 1)}>
              {currentStep === 0 ? "Start Sequence" : "Next Step"} <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button variant="secondary" className="flex-1" onClick={() => { setCurrentStep(0); setShowProbabilityTrap(false); }}>
              Reset Walkthrough
            </Button>
          )}
        </div>
      </div>

      {/* Right Pane: Composed Statement */}
      <div className="w-full lg:w-2/3 flex flex-col">
        <h3 className="text-xl font-medium text-slate-800 mb-4 flex items-center gap-2">
          The Composed Statement
          {currentStep === 6 && <Badge variant="success">Final Output</Badge>}
        </h3>

        <div className="bg-amber-50/30 border border-amber-200/50 rounded-lg p-6 space-y-5 relative overflow-hidden min-h-[500px]">

          {currentStep === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-50/50 z-10">
              Advance the sequence to build the statement.
            </div>
          ) : null}

          {/* 1. Chart Context */}
          <div className={`transition-opacity duration-500 ${isVisible(1) ? "opacity-100" : "opacity-0 hidden"}`}>
            <h4 className="text-sm font-medium text-amber-800 uppercase tracking-wider mb-1">1. Chart context</h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              Chart MD1; marriage-promise question; birth data treated as known and reliable to the tolerance already disclosed; Lahiri ayanāṁśa/whole-sign houses (Parāśarī default), Krishnamurti ayanāṁśa/Placidus cusps (KP layer, disclosed); proceed.
            </p>
          </div>

          {/* 2. Indicators */}
          <div className={`transition-opacity duration-500 ${isVisible(3) ? "opacity-100" : "opacity-0 hidden"}`}>
            <h4 className="text-sm font-medium text-amber-800 uppercase tracking-wider mb-1">2. Indicators</h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              Saturn is named as this question's own central factor by four independent mechanisms — Parāśarī 7th lordship (dusthāna-placed, enemy sign, no benefic aspect), KP's cuspal sub-lord (direct 7th-house ownership), Jaimini's Dārakāraka (lowest-degree cara-kāraka), and Lal Kitab's Teva box-4 reading — plus a fifth, partial thread from Tājika's own guaranteed Varśeśa candidacy.
            </p>
          </div>

          {/* 3. Confidence */}
          <div className={`transition-opacity duration-500 ${isVisible(4) ? "opacity-100" : "opacity-0 hidden"}`}>
            <h4 className="text-sm font-medium text-amber-800 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>3. Confidence</span>
              {isVisible(6) && !showProbabilityTrap && (
                <button
                  onClick={() => setShowProbabilityTrap(true)}
                  className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <AlertCircle className="w-3 h-3" />
                  [Try adding 70% probability]
                </button>
              )}
            </h4>

            {showProbabilityTrap ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-2 flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <span className="font-medium block mb-1">Action Blocked: False Precision</span>
                  No stream in this module produces a numeric probability. A count of &quot;streams leaning positive&quot; collapses the substrate/verdict distinction. Corroborating streams are not votes. Use qualitative tiers.
                  <button
                    onClick={() => setShowProbabilityTrap(false)}
                    className="block mt-2 text-indigo-600 hover:underline"
                  >
                    Restore qualitative framing
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-slate-700 text-sm leading-relaxed">
                Two verdict-bearing streams answer this question's own two sub-questions differently: Parāśarī reads weak-to-moderate, leaning weak, on what-is-it-like; KP reads a clean YES, margin verified robust, on whether. Both are reported; neither is averaged or dropped. A minor but genuine timing convergence supports treating the current period as a well-founded time to examine the question. <span className="font-medium">Cross-stream result: complete, 5 of 5 core streams represented; verdict genuinely, examinedly bifurcated.</span>
              </p>
            )}
          </div>

          {/* 4. Caveats */}
          <div className={`transition-opacity duration-500 ${isVisible(4) ? "opacity-100" : "opacity-0 hidden"}`}>
            <h4 className="text-sm font-medium text-amber-800 uppercase tracking-wider mb-1">4. Caveats</h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              This statement addresses two sub-questions, not one. The KP margin is real but not spacious. Tājika's own Varśeśa finding is partial. A separate dharma-question thread exists on this chart and is not part of this statement.
            </p>
          </div>

          {/* 5. Ethical Framing */}
          <div className={`transition-opacity duration-500 ${isVisible(5) ? "opacity-100" : "opacity-0 hidden"}`}>
            <h4 className="text-sm font-medium text-amber-800 uppercase tracking-wider mb-1">5. Ethical framing</h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              A client hearing this statement should hear an accurate, layered picture, not a false single number — the bifurcation is not this reading's own weakness, it is the evidence's own honest shape.
            </p>
          </div>

          {/* 6. Follow-up */}
          <div className={`transition-opacity duration-500 ${isVisible(5) ? "opacity-100" : "opacity-0 hidden"}`}>
            <h4 className="text-sm font-medium text-amber-800 uppercase tracking-wider mb-1">6. Follow-up</h4>
            <p className="text-slate-700 text-sm leading-relaxed">
              Birth-time confirmation is the single highest-value next step for sharpening the verdict question further. No dasha-level timing analysis for the featured varṣa year has been performed; that remains open.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
